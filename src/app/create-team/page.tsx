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
      <div className="max-w-md w-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
        <Loader />
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Redirecting to registration...
        </p>
      </div>
    </div>
  );
}
