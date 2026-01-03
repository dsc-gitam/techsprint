"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import {
  getDoc,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  QrCodeScanner,
  CheckCircle,
  PersonAdd,
  CardGiftcard,
  CameraAlt,
  ExitToApp,
  Close,
  Restaurant,
  DinnerDining,
} from "@mui/icons-material";
import { Html5QrcodeScanner } from "html5-qrcode";

type ActionType = "check-in" | "check-out" | "swag" | "photobooth" | "lunch" | "dinner";

interface ScannedUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  displayPicture: string;
  teamCode: string;
  teamName: string;
  payment_status: string;
}

export default function Scanner() {
  const user = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType>("check-in");
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);
  const [manualUid, setManualUid] = useState("");
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recentActions, setRecentActions] = useState<any[]>([]);

  useEffect(() => {
    if (user === null) {
      alert("Please login to access scanner");
      router.push("/");
      return;
    }

    getDoc(doc(db, "registrations", user.uid)).then(async (document) => {
      const response = document.data();
      if (response?.role === "admin" || response?.role === "staff") {
        setIsStaff(true);
        fetchRecentActions();
        setLoading(false);
      } else {
        alert("Access denied. Staff privileges required.");
        router.push("/");
      }
    });
  }, [user, router]);

  const fetchRecentActions = async () => {
    try {
      const q = query(
        collection(db, "checkins"),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const actions: any[] = [];
      snapshot.forEach((doc) => {
        actions.push({ id: doc.id, ...doc.data() });
      });
      setRecentActions(actions);
    } catch (error) {
      console.error("Error fetching recent actions:", error);
    }
  };

  const startScanning = () => {
    setScanning(true);
    
    // Delay scanner initialization to ensure DOM element is rendered
    setTimeout(() => {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      html5QrcodeScanner.render(
        (decodedText) => {
          handleScan(decodedText);
          html5QrcodeScanner.clear();
          setScanning(false);
        },
        (errorMessage) => {
          // Ignore errors, just keep scanning
        }
      );

      setScanner(html5QrcodeScanner);
    }, 100);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setScanning(false);
  };

  const handleScan = async (uid: string) => {
    setProcessing(true);
    console.log("🔍 QR Code Scanned - UID:", uid);
    
    try {
      // Fetch user data
      const userDoc = await getDoc(doc(db, "registrations", uid));
      if (!userDoc.exists()) {
        console.error("❌ User not found:", uid);
        alert("User not found. Invalid QR code.");
        setProcessing(false);
        return;
      }

      const userData = userDoc.data();
      console.log("✅ User Data Retrieved:", {
        uid,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        university: userData.university,
        teamCode: userData.teamCode,
        payment_status: userData.payment_status,
        role: userData.role,
      });
      
      // Check if user has checked in (required for swag/photobooth/lunch/dinner)
      if (selectedAction === "swag" || selectedAction === "photobooth" || selectedAction === "lunch" || selectedAction === "dinner") {
        const checkInQuery = query(
          collection(db, "checkins"),
          where("userId", "==", uid),
          where("type", "==", "check-in")
        );
        const checkInSnapshot = await getDocs(checkInQuery);
        if (checkInSnapshot.empty) {
          alert("⚠️ User must check-in first before accessing this service!");
          setProcessing(false);
          return;
        }
      }
      
      // Check payment status for swag/photobooth
      if ((selectedAction === "swag" || selectedAction === "photobooth") && 
          userData.payment_status !== "captured") {
        alert("❌ Payment not confirmed. Cannot proceed with this action.");
        setProcessing(false);
        return;
      }

      // Check for swag duplicate (STRICT - only once per user)
      if (selectedAction === "swag") {
        const swagQuery = query(
          collection(db, "checkins"),
          where("userId", "==", uid),
          where("type", "==", "swag")
        );
        const swagSnapshot = await getDocs(swagQuery);
        if (!swagSnapshot.empty) {
          const swagDate = swagSnapshot.docs[0].data().timestamp?.toDate?.()?.toLocaleString();
          alert(`⚠️ DUPLICATE BLOCKED!\n\nSwag already delivered to this user!\nDelivered at: ${swagDate || "earlier"}`);
          setProcessing(false);
          return;
        }
      }

      // Check for photobooth duplicate (STRICT - only once per user)
      if (selectedAction === "photobooth") {
        const photoQuery = query(
          collection(db, "checkins"),
          where("userId", "==", uid),
          where("type", "==", "photobooth")
        );
        const photoSnapshot = await getDocs(photoQuery);
        if (!photoSnapshot.empty) {
          const photoDate = photoSnapshot.docs[0].data().timestamp?.toDate?.()?.toLocaleString();
          alert(`⚠️ DUPLICATE BLOCKED!\n\nPhotobooth already used by this user!\nUsed at: ${photoDate || "earlier"}`);
          setProcessing(false);
          return;
        }
      }

      // Check for lunch duplicate (STRICT - only once per user)
      if (selectedAction === "lunch") {
        const lunchQuery = query(
          collection(db, "checkins"),
          where("userId", "==", uid),
          where("type", "==", "lunch")
        );
        const lunchSnapshot = await getDocs(lunchQuery);
        if (!lunchSnapshot.empty) {
          const lunchDate = lunchSnapshot.docs[0].data().timestamp?.toDate?.()?.toLocaleString();
          alert(`⚠️ DUPLICATE BLOCKED!\n\nLunch already served to this user!\nServed at: ${lunchDate || "earlier"}`);
          setProcessing(false);
          return;
        }
      }

      // Check for dinner duplicate (STRICT - only once per user)
      if (selectedAction === "dinner") {
        const dinnerQuery = query(
          collection(db, "checkins"),
          where("userId", "==", uid),
          where("type", "==", "dinner")
        );
        const dinnerSnapshot = await getDocs(dinnerQuery);
        if (!dinnerSnapshot.empty) {
          const dinnerDate = dinnerSnapshot.docs[0].data().timestamp?.toDate?.()?.toLocaleString();
          alert(`⚠️ DUPLICATE BLOCKED!\n\nDinner already served to this user!\nServed at: ${dinnerDate || "earlier"}`);
          setProcessing(false);
          return;
        }
      }

      // Fetch team info if user has a team
      let teamName = "No Team";
      if (userData.teamCode) {
        const teamDoc = await getDoc(doc(db, "teams", userData.teamCode));
        if (teamDoc.exists()) {
          teamName = teamDoc.data().teamName;
        }
      }

      setScannedUser({
        uid: uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        university: userData.university === "Other" ? userData.otherUniversity : userData.university,
        displayPicture: userData.displayPicture,
        teamCode: userData.teamCode || "",
        teamName: teamName,
        payment_status: userData.payment_status,
      });
    } catch (error) {
      console.error("Error processing scan:", error);
      alert("Error processing QR code. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleManualEntry = async () => {
    if (!manualUid.trim()) {
      alert("Please enter a User ID");
      return;
    }
    await handleScan(manualUid.trim());
    setManualUid("");
  };

  const confirmAction = async () => {
    if (!scannedUser) return;

    try {
      // Record the action
      await addDoc(collection(db, "checkins"), {
        userId: scannedUser.uid,
        teamCode: scannedUser.teamCode,
        type: selectedAction,
        timestamp: serverTimestamp(),
        scannedBy: user!.uid,
        location: "Tech Sprint 2026",
      });

      // For photobooth, redirect to capture page
      if (selectedAction === "photobooth") {
        router.push(`/photobooth/capture?uid=${scannedUser.uid}`);
        return;
      }

      alert(`✅ ${selectedAction.replace("-", " ").toUpperCase()} recorded successfully!`);
      setScannedUser(null);
      fetchRecentActions();
    } catch (error) {
      console.error("Error recording action:", error);
      alert("Failed to record action. Please try again.");
    }
  };

  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case "check-in":
        return <PersonAdd />;
      case "check-out":
        return <ExitToApp />;
      case "swag":
        return <CardGiftcard />;
      case "photobooth":
        return <CameraAlt />;
      case "lunch":
        return <Restaurant />;
      case "dinner":
        return <DinnerDining />;
    }
  };

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case "check-in":
        return "bg-green-500 hover:bg-green-600 border-green-600";
      case "check-out":
        return "bg-orange-500 hover:bg-orange-600 border-orange-600";
      case "swag":
        return "bg-purple-500 hover:bg-purple-600 border-purple-600";
      case "photobooth":
        return "bg-pink-500 hover:bg-pink-600 border-pink-600";
      case "lunch":
        return "bg-amber-500 hover:bg-amber-600 border-amber-600";
      case "dinner":
        return "bg-blue-500 hover:bg-blue-600 border-blue-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isStaff) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-4 md:py-8 px-2 md:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <QrCodeScanner className="text-blue-500" fontSize="large" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">QR Scanner</h1>
          </div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Scan participant QR codes for check-in, swag delivery, and more
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Side - Scanner */}
          <div>
            {/* Action Selector */}
            <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Select Action</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {(["check-in", "check-out", "swag", "photobooth", "lunch", "dinner"] as ActionType[]).map((action) => (
                  <button
                    key={action}
                    onClick={() => setSelectedAction(action)}
                    className={`flex items-center justify-center gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all ${
                      selectedAction === action
                        ? `${getActionColor(action)} text-white border-2`
                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-400"
                    }`}
                  >
                    {getActionIcon(action)}
                    <span className="capitalize hidden sm:inline">{action.replace("-", " ")}</span>
                    <span className="capitalize sm:hidden">{action === "check-in" ? "In" : action === "check-out" ? "Out" : action === "swag" ? "Swag" : "Photo"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scanner Section */}
            <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Scan QR Code</h2>
              
              {!scanning && !scannedUser && (
                <div>
                  <button
                    onClick={startScanning}
                    className={`w-full py-4 ${getActionColor(selectedAction)} text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mb-4`}
                  >
                    <QrCodeScanner />
                    Start Scanning
                  </button>

                  {/* Manual Entry */}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Manual Entry</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualUid}
                        onChange={(e) => setManualUid(e.target.value)}
                        placeholder="Enter User ID"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={handleManualEntry}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {scanning && (
                <div>
                  <div id="qr-reader" className="w-full mb-4"></div>
                  <button
                    onClick={stopScanning}
                    className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Close />
                    Stop Scanning
                  </button>
                </div>
              )}

              {processing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Processing...</p>
                </div>
              )}

              {scannedUser && (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={scannedUser.displayPicture}
                        className="w-20 h-20 rounded-full"
                        alt={scannedUser.firstName}
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {scannedUser.firstName} {scannedUser.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{scannedUser.university}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{scannedUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Team</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {scannedUser.teamName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Payment</p>
                        <p className={`font-medium ${
                          scannedUser.payment_status === "captured"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {scannedUser.payment_status === "captured" ? "✅ Confirmed" : "❌ Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={confirmAction}
                      className={`flex-1 py-3 ${getActionColor(selectedAction)} text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                    >
                      <CheckCircle />
                      Confirm {selectedAction.replace("-", " ").toUpperCase()}
                    </button>
                    <button
                      onClick={() => setScannedUser(null)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Recent Actions */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Actions</h2>
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white dark:bg-[#0a0a0a] rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getActionIcon(action.type)}
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {action.type.replace("-", " ")}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {action.timestamp?.toDate?.()?.toLocaleString() || "Just now"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    User ID: {action.userId}
                  </p>
                  {action.teamCode && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Team: {action.teamCode}
                    </p>
                  )}
                </div>
              ))}

              {recentActions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No recent actions
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
