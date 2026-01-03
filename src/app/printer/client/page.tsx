"use client";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { Print, CheckCircle, Error as ErrorIcon, Wifi, WifiOff, VolumeUp } from "@mui/icons-material";

interface PrintJob {
  id: string;
  userId: string;
  userName: string;
  teamName: string;
  classroom: string;
  photoUrl: string;
  status: string;
  createdAt: any;
  printedAt?: any;
}

export default function PrinterClient() {
  const [connected, setConnected] = useState(false);
  const [currentJob, setCurrentJob] = useState<PrintJob | null>(null);
  const [recentJobs, setRecentJobs] = useState<PrintJob[]>([]);
  const [stats, setStats] = useState({
    totalPrints: 0,
    successfulPrints: 0,
    failedPrints: 0,
  });
  const [printerName] = useState(`Printer-${Math.random().toString(36).substring(7)}`);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date>(new Date());

  const wakeLockRef = useRef<any>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializePrinterClient();

    return () => {
      cleanup();
    };
  }, []);

  const initializePrinterClient = async () => {
    await requestWakeLock();
    startHeartbeat();
    connectToFirestore();
  };

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        console.log("Wake Lock activated");
      }
    } catch (error) {
      console.error("Wake Lock error:", error);
    }
  };

  const startHeartbeat = () => {
    heartbeatIntervalRef.current = setInterval(() => {
      setLastHeartbeat(new Date());
    }, 30000);
  };

  const connectToFirestore = () => {
    try {
      const q = query(
        collection(db, "printQueue"),
        where("status", "==", "pending"),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setConnected(true);

          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added") {
              const jobData = { id: change.doc.id, ...change.doc.data() } as PrintJob;
              await handleAutoPrint(jobData);
            }
          });
        },
        (error) => {
          console.error("Firestore connection error:", error);
          setConnected(false);
          attemptReconnect();
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      console.error("Connection error:", error);
      attemptReconnect();
    }
  };

  const attemptReconnect = () => {
    setTimeout(() => {
      console.log("Attempting to reconnect...");
      connectToFirestore();
    }, 5000);
  };

  const handleAutoPrint = async (job: PrintJob, retryCount = 0) => {
    console.log(`Processing print job for ${job.userName}`);
    setCurrentJob(job);

    try {
      await updateDoc(doc(db, "printQueue", job.id), {
        status: "printing",
        printerName,
      });

      playNotificationSound();

      const success = await printPhoto(job.photoUrl);

      if (success) {
        await updateDoc(doc(db, "printQueue", job.id), {
          status: "completed",
          printedAt: serverTimestamp(),
        });

        setStats((prev) => ({
          totalPrints: prev.totalPrints + 1,
          successfulPrints: prev.successfulPrints + 1,
          failedPrints: prev.failedPrints,
        }));

        setRecentJobs((prev) => [{ ...job, status: "completed" }, ...prev.slice(0, 9)]);
        setCurrentJob(null);
      } else {
        throw new Error("Print failed");
      }
    } catch (error) {
      console.error("Print error:", error);

      if (retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1}/3`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return handleAutoPrint(job, retryCount + 1);
      }

      await updateDoc(doc(db, "printQueue", job.id), {
        status: "failed",
        error: "Print failed after 3 attempts",
      });

      setStats((prev) => ({
        totalPrints: prev.totalPrints + 1,
        successfulPrints: prev.successfulPrints,
        failedPrints: prev.failedPrints + 1,
      }));

      setRecentJobs((prev) => [{ ...job, status: "failed" }, ...prev.slice(0, 9)]);
      setCurrentJob(null);
    }
  };

  const printPhoto = async (photoUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        document.body.removeChild(iframe);
        resolve(false);
        return;
      }

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page {
              size: auto;
              margin: 0mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${photoUrl}" />
        </body>
        </html>
      `);
      iframeDoc.close();

      const img = iframeDoc.querySelector("img");
      if (!img) {
        document.body.removeChild(iframe);
        resolve(false);
        return;
      }

      const loadTimeout = setTimeout(() => {
        document.body.removeChild(iframe);
        resolve(false);
      }, 10000);

      img.onload = () => {
        clearTimeout(loadTimeout);

        setTimeout(() => {
          try {
            iframe.contentWindow?.print();

            setTimeout(() => {
              document.body.removeChild(iframe);
              resolve(true);
            }, 2000);
          } catch (error) {
            console.error("Print command error:", error);
            document.body.removeChild(iframe);
            resolve(false);
          }
        }, 500);
      };

      img.onerror = () => {
        clearTimeout(loadTimeout);
        document.body.removeChild(iframe);
        resolve(false);
      };
    });
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

  const cleanup = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
              <div>
                <h1 className="text-3xl font-bold text-white">🖨️ Printer Client</h1>
                <p className="text-white/70 text-sm">{printerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white">
              <div className="text-center">
                {connected ? (
                  <div className="flex items-center gap-2">
                    <Wifi className="text-green-400" />
                    <span className="text-green-400 font-bold">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <WifiOff className="text-red-400" />
                    <span className="text-red-400 font-bold">Disconnected</span>
                  </div>
                )}
                <p className="text-xs text-white/60 mt-1">
                  Last heartbeat: {lastHeartbeat.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <Print style={{ fontSize: "3rem", color: "white" }} />
            <p className="text-4xl font-bold text-white mt-4">{stats.totalPrints}</p>
            <p className="text-white/70 mt-1">Total Prints</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <CheckCircle style={{ fontSize: "3rem", color: "#4ade80" }} />
            <p className="text-4xl font-bold text-green-400 mt-4">{stats.successfulPrints}</p>
            <p className="text-white/70 mt-1">Successful</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <ErrorIcon style={{ fontSize: "3rem", color: "#f87171" }} />
            <p className="text-4xl font-bold text-red-400 mt-4">{stats.failedPrints}</p>
            <p className="text-white/70 mt-1">Failed</p>
          </div>
        </div>

        {currentJob && (
          <div className="bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30 mb-8">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">Currently Printing...</h2>
                <p className="text-white/90 text-lg">{currentJob.userName}</p>
                <p className="text-white/70 text-sm">{currentJob.teamName} • {currentJob.classroom}</p>
              </div>
              <VolumeUp className="text-white" style={{ fontSize: "2rem" }} />
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Prints</h2>

          {recentJobs.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Print style={{ fontSize: "4rem", opacity: 0.3 }} />
              <p className="mt-4">Waiting for print jobs...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/5 rounded-xl p-4 flex items-center gap-4"
                >
                  {job.status === "completed" ? (
                    <CheckCircle className="text-green-400" />
                  ) : (
                    <ErrorIcon className="text-red-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-bold">{job.userName}</p>
                    <p className="text-white/70 text-sm">{job.teamName}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${job.status === "completed" ? "text-green-400" : "text-red-400"}`}>
                      {job.status === "completed" ? "✓ Printed" : "✗ Failed"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
