"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { Settings, Visibility, VisibilityOff, Save } from "@mui/icons-material";
import Loader from "@/components/LoadingAnimation/page";

export default function AdminSettingsPage() {
  const user = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (user === null) {
      alert("Please login to access admin settings");
      window.location.href = "/";
      return;
    }

    // Check if user is admin
    getDoc(doc(db, "registrations", user.uid)).then((document) => {
      const response = document.data();
      if (response == undefined) {
        alert("Please login to access admin settings");
        window.location.href = "/";
        return;
      }
      if (response.role !== "admin" && response.role !== "staff") {
        alert("Admin or staff access required");
        window.location.href = "/";
        return;
      }
      setIsAdmin(true);
      loadSettings();
    });
  }, [user]);

  const loadSettings = async () => {
    try {
      const configDoc = await getDoc(doc(db, "config", "leaderboard"));
      if (configDoc.exists()) {
        setLeaderboardVisible(configDoc.data().visible ?? true);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLeaderboardVisibility = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      await updateDoc(doc(db, "config", "leaderboard"), {
        visible: leaderboardVisible,
        updatedAt: Timestamp.now(),
      });
      setSaveMessage("✅ Leaderboard visibility updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage("❌ Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-blue-500" fontSize="large" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage event configurations and visibility controls
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Leaderboard Visibility */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  {leaderboardVisible ? (
                    <Visibility className="text-green-500" />
                  ) : (
                    <VisibilityOff className="text-red-500" />
                  )}
                  Leaderboard Visibility
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Control whether participants can view the leaderboard. Hide it between milestones to build suspense.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setLeaderboardVisible(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  leaderboardVisible
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Visibility className="mr-2" />
                Visible
              </button>
              <button
                onClick={() => setLeaderboardVisible(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  !leaderboardVisible
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <VisibilityOff className="mr-2" />
                Hidden
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Current Status:</strong> Leaderboard is{" "}
                <span className={leaderboardVisible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {leaderboardVisible ? "VISIBLE" : "HIDDEN"}
                </span>{" "}
                to all participants.
              </p>
            </div>

            <button
              onClick={handleSaveLeaderboardVisibility}
              disabled={saving}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save />
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {saveMessage && (
              <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                <p className="text-sm font-medium">{saveMessage}</p>
              </div>
            )}
          </div>

          {/* Additional Settings Placeholder */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700 opacity-50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              More Settings Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Additional event configuration options will be added here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
