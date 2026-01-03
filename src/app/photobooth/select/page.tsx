"use client";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { Check, PhotoLibrary, Print, ArrowBack } from "@mui/icons-material";

interface UserData {
  firstName: string;
  lastName: string;
  teamCode: string;
  teamName: string;
  classroom: string;
}

export default function PhotoSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyPrinted, setAlreadyPrinted] = useState(false);

  useEffect(() => {
    if (!uid) {
      alert("No user ID provided");
      router.push("/");
      return;
    }

    checkAndLoadData();
  }, [uid]);

  const checkAndLoadData = async () => {
    if (!uid) return;

    try {
      const userDoc = await getDoc(doc(db, "registrations", uid));
      if (!userDoc.exists()) {
        alert("User not found");
        router.push("/");
        return;
      }

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

      const printQuery = query(
        collection(db, "printQueue"),
        where("userId", "==", uid),
        where("status", "==", "completed")
      );
      const printSnapshot = await getDocs(printQuery);

      if (!printSnapshot.empty) {
        setAlreadyPrinted(true);
        setLoading(false);
        return;
      }

      const folderRef = ref(storage, `photobooth/${uid}`);
      const result = await listAll(folderRef);

      if (result.items.length === 0) {
        alert("No photos found. Please take photos first.");
        router.push("/staff/scanner");
        return;
      }

      const urls = await Promise.all(
        result.items.map((item) => getDownloadURL(item))
      );

      setPhotos(urls);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load photos");
      router.push("/");
    }
  };

  const handleSelectPhoto = async () => {
    if (!selectedPhoto || !uid || !userData) {
      alert("Please select a photo");
      return;
    }

    setSubmitting(true);

    try {
      const printQuery = query(
        collection(db, "printQueue"),
        where("userId", "==", uid),
        where("status", "==", "completed")
      );
      const printSnapshot = await getDocs(printQuery);

      if (!printSnapshot.empty) {
        alert("Already printed! You can only print once.");
        setAlreadyPrinted(true);
        setSubmitting(false);
        return;
      }

      await addDoc(collection(db, "printQueue"), {
        userId: uid,
        userName: `${userData.firstName} ${userData.lastName}`,
        teamName: userData.teamName,
        teamCode: userData.teamCode,
        classroom: userData.classroom,
        photoUrl: selectedPhoto,
        status: "pending",
        createdAt: serverTimestamp(),
        printedAt: null,
        printerName: null,
      });

      setSuccess(true);
    } catch (error) {
      console.error("Error submitting photo:", error);
      alert("Failed to submit photo. Please try again.");
      setSubmitting(false);
    }
  };

  const goBackToScanner = () => {
    router.push("/staff/scanner");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          <p className="text-white text-lg">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (alreadyPrinted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Print style={{ fontSize: "3rem", color: "white" }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Already Printed!</h1>
            <p className="text-white/80 text-lg">
              {userData?.firstName}, you've already printed your photo.
              <br />
              Each person can only print once.
            </p>
          </div>
          <button
            onClick={goBackToScanner}
            className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition-colors"
          >
            Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check style={{ fontSize: "3rem", color: "white" }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Photo Submitted!</h1>
            <p className="text-white/80 text-lg">
              Your photo has been sent to the printer.
              <br />
              Please collect your print at the printer station.
            </p>
          </div>
          <button
            onClick={goBackToScanner}
            className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition-colors"
          >
            Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📸 Select Your Photo</h1>
          <p className="text-xl text-white/90">
            Hi {userData?.firstName}! Choose your favorite photo to print
          </p>
          <p className="text-sm text-white/70 mt-1">
            {userData?.teamName} • {userData?.classroom}
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <PhotoLibrary style={{ fontSize: "4rem", color: "white" }} />
            <p className="text-white text-xl mt-4">No photos available</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all transform hover:scale-105 ${
                    selectedPhoto === photo
                      ? "border-green-400 shadow-lg shadow-green-500/50"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedPhoto === photo && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <Check style={{ fontSize: "2rem", color: "white" }} />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                    #{index + 1}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSelectPhoto}
              disabled={!selectedPhoto || submitting}
              className="w-full py-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-2xl font-bold text-2xl transition-colors flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Print />
                  Print Selected Photo
                </>
              )}
            </button>

            {!selectedPhoto && (
              <p className="text-center text-white/70 mt-4 text-sm">
                ☝️ Tap a photo to select it, then click Print
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
