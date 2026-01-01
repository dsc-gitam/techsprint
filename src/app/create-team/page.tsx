"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/LoadingAnimation/page";

/**
 * DEPRECATED: This page is no longer used in the main registration flow.
 * Team creation is now integrated directly into the /register page.
 * This page is kept for backward compatibility with existing links.
 */
export default function CreateTeam() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to registration page where team creation is now integrated
    router.push("/register");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] px-4 py-12">
      {/* <div className="max-w-md w-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-700 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Your Team</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choose a unique team name and get a referral code to share with your team members
        </p>

        <form className="space-y-4">
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
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">Team Size: 2-5 members</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              After creating your team, share the referral code with 1-4 team members to join your team.
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
      </div> */}
    </div>
  );
}
