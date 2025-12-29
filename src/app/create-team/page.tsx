"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, collection, query, where, getCountFromServer } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Loader from "@/components/LoadingAnimation/page";
import { ContentCopy, CheckCircle } from "@mui/icons-material";

export default function CreateTeam() {
  const user = useAuthContext();
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [teamCreated, setTeamCreated] = useState(false);

  useEffect(() => {
    if (!user) {
      alert("Please login to create a team");
      router.push("/");
    }
  }, [user, router]);

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Check if team name is unique
      const teamsRef = collection(db, "teams");
      const teamQuery = query(teamsRef, where("teamName", "==", teamName));
      const count = (await getCountFromServer(teamQuery)).data().count;

      if (count > 0) {
        alert("Team name already exists. Please choose a different name.");
        setLoading(false);
        return;
      }

      // Generate referral code
      const code = generateReferralCode();
      setReferralCode(code);

      // Get team number
      const teamNumber = (await getCountFromServer(query(teamsRef))).data().count + 1;

      // Create team document
      await setDoc(doc(db, "teams", teamName), {
        teamName: teamName,
        teamNumber: teamNumber,
        referralCode: code,
        leaderId: user.uid,
        participants: [user.uid],
        createdAt: new Date().toISOString(),
      });

      // Update user's registration
      await updateDoc(doc(db, "registrations", user.uid), {
        isTeamLead: 1,
        isTeamMember: 1,
        teamName: teamName,
      });

      setTeamCreated(true);
      setLoading(false);
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralCode = () => {
    const shareText = `Join my team "${teamName}" for TechSprint 2026! Use code: ${referralCode}\n\nRegister at: ${window.location.origin}/register`;
    
    if (navigator.share) {
      navigator.share({
        title: "Join my TechSprint team!",
        text: shareText,
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  if (loading && !teamCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-900 dark:text-white">Creating your team...</p>
        </div>
      </div>
    );
  }

  if (teamCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" style={{ fontSize: 64 }} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Created Successfully!</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">Team: {teamName}</p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Referral Code</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tracking-widest">{referralCode}</p>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <ContentCopy className="text-blue-600 dark:text-blue-400" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-gray-700 dark:text-gray-300 font-medium">Share this code with your team members</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Team members should enter this code when registering for TechSprint 2026
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={shareReferralCode}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              Share Code
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-700 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Your Team</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choose a unique team name and get a referral code to share with your team members
        </p>

        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              required
              minLength={3}
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose a unique name for your team (3-50 characters)
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">Team Size: 2-4 members</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              After creating your team, share the referral code with 1-3 team members to join your team.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Create Team
          </button>
        </form>
      </div>
    </div>
  );
}
