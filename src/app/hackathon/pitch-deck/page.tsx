"use client";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { CloudUpload, VideoLibrary, CheckCircle, Description } from "@mui/icons-material";
import Link from "next/link";

export default function PitchDeckSubmission() {
  const user = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const deadline = new Date("4 Jan 2026 17:00:00 GMT+0530");
  const isBeforeDeadline = new Date() < deadline;

  useEffect(() => {
    if (!user) {
      alert("Please login to submit pitch deck");
      router.push("/");
      return;
    }

    getDoc(doc(db, "registrations", user.uid)).then(async (document) => {
      const response = document.data();
      setUserData(response);

      if (!response?.teamCode) {
        alert("You must be part of a team to submit a pitch deck");
        router.push("/profile");
        return;
      }

      const teamDoc = await getDoc(doc(db, "teams", response.teamCode));
      if (teamDoc.exists()) {
        const teamInfo = teamDoc.data();
        setTeamData(teamInfo);
        
        // Check if already submitted
        if (teamInfo.pitchDeckLink) {
          setHasSubmitted(true);
          setVideoLink(teamInfo.pitchRecordingLink || "");
        }
      }

      setLoading(false);
    });
  }, [user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF, PPT, or PPTX file");
        return;
      }

      if (file.size > maxSize) {
        alert("File size must be less than 10MB");
        return;
      }

      setPitchDeckFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pitchDeckFile) {
      alert("Please select a pitch deck file to upload");
      return;
    }

    if (userData?.role !== "leader") {
      alert("Only team leaders can submit the pitch deck");
      return;
    }

    if (!isBeforeDeadline) {
      alert("Submission deadline has passed");
      return;
    }

    setSubmitting(true);

    try {
      // Upload file to Firebase Storage
      const storage = getStorage();
      const fileRef = ref(storage, `pitch-decks/${teamData.teamCode}_${Date.now()}.${pitchDeckFile.name.split('.').pop()}`);
      await uploadBytes(fileRef, pitchDeckFile);
      const downloadURL = await getDownloadURL(fileRef);

      // Update team document
      await updateDoc(doc(db, "teams", teamData.teamCode), {
        pitchDeckLink: downloadURL,
        pitchRecordingLink: videoLink || "",
        pitchSubmittedAt: serverTimestamp(),
      });

      alert("✅ Pitch deck submitted successfully!");
      setHasSubmitted(true);
      
      // Refresh team data
      const teamDoc = await getDoc(doc(db, "teams", teamData.teamCode));
      if (teamDoc.exists()) {
        setTeamData(teamDoc.data());
      }
    } catch (error) {
      console.error("Error submitting pitch deck:", error);
      alert("Failed to submit pitch deck. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Description className="text-blue-500" fontSize="large" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pitch Deck Submission</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Submit your team's final pitch deck and recording
          </p>
        </div>

        {/* Deadline Banner */}
        <div className={`mb-6 p-4 rounded-lg border ${
          isBeforeDeadline
            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}>
          <p className={`font-semibold ${
            isBeforeDeadline
              ? "text-blue-800 dark:text-blue-200"
              : "text-red-800 dark:text-red-200"
          }`}>
            {isBeforeDeadline
              ? `📅 Deadline: ${deadline.toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}`
              : "⚠️ Submission deadline has passed"
            }
          </p>
        </div>

        {/* Resources Link */}
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200 mb-2">
            📚 Need help? Check out our resources:
          </p>
          <Link
            href="/resources/pitch-deck"
            className="text-green-600 dark:text-green-400 hover:underline font-medium"
          >
            View Pitch Deck Template & Examples →
          </Link>
        </div>

        {/* Submission Status */}
        {hasSubmitted && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" fontSize="large" />
              <div>
                <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
                  Pitch Deck Submitted
                </h2>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Submitted on {teamData.pitchSubmittedAt?.toDate?.()?.toLocaleString() || "N/A"}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0a0a0a] rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Pitch Deck File</span>
                <a
                  href={teamData.pitchDeckLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View File
                </a>
              </div>
              {teamData.pitchRecordingLink && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0a0a0a] rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Video Recording</span>
                  <a
                    href={teamData.pitchRecordingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Video
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Info */}
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Team Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Team Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{teamData?.teamName}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Team Code</p>
              <p className="font-medium text-gray-900 dark:text-white">{teamData?.teamCode}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Your Role</p>
              <p className={`font-medium ${
                userData?.role === "leader"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-900 dark:text-white"
              }`}>
                {userData?.role === "leader" ? "Team Leader ⭐" : "Team Member"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Classroom</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {teamData?.allottedClassroom || "Not Assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        {userData?.role === "leader" && isBeforeDeadline && !hasSubmitted && (
          <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Submit Pitch Deck</h2>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Pitch Deck File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <CloudUpload className="mx-auto text-gray-400 mb-2" fontSize="large" />
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pitch-deck-upload"
                  />
                  <label
                    htmlFor="pitch-deck-upload"
                    className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Click to upload
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PDF, PPT, or PPTX (Max 10MB)
                  </p>
                  {pitchDeckFile && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      ✓ Selected: {pitchDeckFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Video Link */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Video Recording Link (Optional)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <VideoLibrary className="text-gray-400" />
                  <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://youtube.com/... or https://drive.google.com/..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  YouTube, Google Drive, or any public video link
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !pitchDeckFile}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Pitch Deck"}
              </button>
            </div>
          </form>
        )}

        {/* Not Leader Message */}
        {userData?.role !== "leader" && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200">
              ℹ️ Only your team leader can submit the pitch deck. Please coordinate with your team leader.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
