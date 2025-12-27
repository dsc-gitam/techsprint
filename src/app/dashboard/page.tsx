"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import GetUserProgress from "@/utils/getUserProgress";
import Progress from "@/utils/progress";
import Loader from "@/components/LoadingAnimation/page";

export default function Dashboard() {
  const user = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Not signed in, go to home
      router.push("/");
      return;
    }

    // Check user's registration progress and redirect accordingly
    GetUserProgress(user.uid).then((progress) => {
      switch (progress) {
        case Progress.noApplication:
        case Progress.paymentPending:
          // User hasn't registered or payment pending
          router.push("/register");
          break;
        
        case Progress.incompleteRegistration:
        case Progress.notYetTeamMember:
          // User registered but not in team yet
          router.push("/confirmation");
          break;
        
        case Progress.completeRegistration:
        case Progress.completeRegistrationTeamLead:
          // User is fully registered with team
          router.push("/profile");
          break;
        
        default:
          // Fallback to profile
          router.push("/profile");
          break;
      }
    }).catch((error) => {
      console.error("Error checking user progress:", error);
      // On error, redirect to register to be safe
      router.push("/register");
    }).finally(() => {
      setLoading(false);
    });
  }, [user, router]);

  if (loading) {
    return (
      <div className="fixed top-0 bg-white w-full h-full">
        <Loader />
      </div>
    );
  }

  return null;
}
