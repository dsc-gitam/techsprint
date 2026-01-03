"use client";

import { db, storage } from "@/lib/firebase";
import Loader from "@/components/LoadingAnimation/page";
import { useAuthContext } from "@/context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { CloudUpload, CheckCircle } from "@mui/icons-material";

export default function Page() {
  const user = useAuthContext();
  const [teamDocId, setTeamDocId] = useState<string | undefined>(undefined);
  const [isLoading, setLoader] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionTime, setSubmissionTime] = useState<string>("");

  useEffect(() => {
    if (user != null) {
      const refTeam = collection(db, "teams");
      getDocs(query(refTeam, where("participants", "array-contains", user.uid)))
        .then(async (snapshot) => {
          if (snapshot.docs.length > 0) {
            const teamDetailsId = snapshot.docs[0].id;
            setTeamDocId(teamDetailsId);
            const dt = snapshot.docs[0].data()["milestone_ten_time"];
            if (dt != undefined && dt != null) {
              setHasSubmitted(true);
              setSubmissionTime(dt.toDate().toLocaleString());
            }
          }
        })
        .then((_) => {
          setLoader(false);
        });
    } else {
      setLoader(false);
    }
  }, [user]);

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase text-blue-500 mb-2">
              Milestone 10 - Final Submission
            </h3>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Launchpad - Final Submission!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Submit your final project files, documentation, and demo materials. This is your chance to showcase everything you've built!
            </p>
          </div>

          {hasSubmitted ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-600 dark:text-green-400" fontSize="large" />
                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                    Submission Completed!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your final submission was recorded at {submissionTime}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Thank you for participating in Tech Sprint 2026! Your project will be reviewed by our judges. Good luck! 🚀
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Upload Your Final Submission
              </h3>
              
              <form
                onSubmit={async (f) => {
                  f.preventDefault();
                  setLoader(true);
                  
                  try {
                    const file = new FormData(f.currentTarget).get("submission");
                    
                    if (!file || !(file as File).name) {
                      alert("Please select a file to upload");
                      setLoader(false);
                      return;
                    }
                    
                    const r = ref(
                      storage,
                      `milestone_ten/${teamDocId}/${(file as File).name}`
                    );
                    
                    await uploadBytes(r, file as File);
                    const dUrl = await getDownloadURL(r);
                    
                    if (teamDocId != undefined) {
                      await updateDoc(doc(db, "teams", teamDocId), {
                        milestone_ten_link: dUrl,
                        milestone_ten_score_aggregate: -1,
                        milestone_ten_time: serverTimestamp(),
                        milestone_ten_score: {},
                      });
                      
                      alert("✅ Final submission uploaded successfully!");
                      setHasSubmitted(true);
                      setSubmissionTime(new Date().toLocaleString());
                    }
                  } catch (error) {
                    console.error("Upload error:", error);
                    alert("❌ Upload failed. Please try again.");
                  } finally {
                    setLoader(false);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Project Files
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Upload a ZIP file containing:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                    <li>Complete source code</li>
                    <li>Documentation (README, setup instructions)</li>
                    <li>Demo video or screenshots</li>
                    <li>Any additional materials</li>
                  </ul>
                  <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <input
                      name="submission"
                      type="file"
                      accept=".zip,.rar,.7z"
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <CloudUpload className="mx-auto text-gray-400 mb-2" fontSize="large" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        ZIP, RAR, or 7Z files (max 50MB recommended)
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CloudUpload />
                  Submit Final Project
                </button>
              </form>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Important:</strong> Make sure to double-check your files before submitting. You can only submit once!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed top-0 left-0 bg-white dark:bg-[#0a0a0a] w-full h-full z-50">
          <Loader />
        </div>
      )}
    </>
  );
}
