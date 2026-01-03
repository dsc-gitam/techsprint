"use client";
import { useEffect, useState, useRef } from "react";
import { db, storage } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { CameraAlt, PhotoCamera, Check, Delete, ArrowBack } from "@mui/icons-material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface UserData {
  firstName: string;
  lastName: string;
  teamCode: string;
  teamName: string;
  classroom: string;
}

export default function StaffPhotoCapture() {
  const user = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const participantUid = searchParams.get("uid");
  
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!user || !participantUid) {
      alert("Invalid access");
      router.push("/staff/scanner");
      return;
    }

    getDoc(doc(db, "registrations", user.uid)).then(async (staffDoc) => {
      const staffData = staffDoc.data();
      if (staffData?.role !== "staff" && staffData?.role !== "admin") {
        alert("Access denied. Staff only.");
        router.push("/");
        return;
      }
      
      setIsStaff(true);
      await fetchParticipantData();
      setLoading(false);
    });
  }, [user, participantUid]);

  const fetchParticipantData = async () => {
    if (!participantUid) return;

    const userDoc = await getDoc(doc(db, "registrations", participantUid));
    if (!userDoc.exists()) return;

    const data = userDoc.data();
    let teamName = "No Team";
    let classroom = "Not Assigned";
    
    if (data.teamCode) {
      const teamDoc = await getDoc(doc(db, "teams", data.teamCode));
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
        teamName = teamData.teamName;
        classroom = teamData.allottedClassroom || "Not Assigned";
      }
    }

    setUserData({
      firstName: data.firstName,
      lastName: data.lastName,
      teamCode: data.teamCode || "",
      teamName,
      classroom,
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 4000 },
          height: { ideal: 3000 },
          aspectRatio: { ideal: 4/3 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1440 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          streamRef.current = fallbackStream;
          setCameraActive(true);
        }
      } catch (fallbackError) {
        alert("Failed to access camera. Please check permissions.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoUrl = canvas.toDataURL("image/jpeg", 0.95);
    setPhotos([...photos, photoUrl]);
  };

  const deletePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const uploadAndContinue = async () => {
    if (photos.length === 0) {
      alert("Please take at least one photo");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = photos.map(async (photoData, index) => {
        const blob = await (await fetch(photoData)).blob();
        const timestamp = Date.now();
        const storageRef = ref(storage, `photobooth/${participantUid}/${timestamp}_${index}.jpg`);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      });

      await Promise.all(uploadPromises);
      
      stopCamera();
      router.push(`/photobooth/select?uid=${participantUid}`);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const goBack = () => {
    stopCamera();
    router.push("/staff/scanner");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isStaff) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
          >
            <ArrowBack />
            Back
          </button>
          
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-1">📸 Staff Camera</h1>
            <p className="text-lg">
              Taking photos for: {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-sm text-white/80">
              {userData?.teamName} • {userData?.classroom}
            </p>
          </div>
          
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Camera</h2>

            {!cameraActive ? (
              <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                <button
                  onClick={startCamera}
                  className="flex flex-col items-center gap-3 px-8 py-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors"
                >
                  <PhotoCamera style={{ fontSize: "4rem" }} />
                  <span className="text-xl font-bold">Start Camera</span>
                </button>
              </div>
            ) : (
              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full aspect-video bg-black rounded-xl"
                />
              </div>
            )}

            {cameraActive && (
              <button
                onClick={capturePhoto}
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <PhotoCamera />
                Capture Photo
              </button>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Captured ({photos.length})
            </h2>

            {photos.length === 0 ? (
              <div className="aspect-video bg-gray-800/50 rounded-xl flex items-center justify-center">
                <p className="text-white/60 text-center">
                  No photos yet<br />
                  <span className="text-sm">Take photos using camera</span>
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4 max-h-96 overflow-y-auto">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        onClick={() => deletePhoto(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Delete fontSize="small" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={uploadAndContinue}
                  disabled={uploading}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check />
                      Continue to Selection
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
