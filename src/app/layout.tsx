"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { AuthContextProvider, useAuthContext } from "@/context/AuthContext";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { Suspense, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import GetUserProgress from "@/utils/getUserProgress";
import Progress from "@/utils/progress";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Google TechSprint Hackathon",
//   description: "Join the Google TechSprint Hackathon. Build the future with Google technologies.",
// };

export function SignOutDialog() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("signout") === "";
  const pathName = usePathname();
  console.log("modal", modal, pathName);
  return (
    <>
      <dialog
        className={`fixed left-0 top-0 w-full h-full ${modal ? "bg-black bg-opacity-50 z-50 backdrop-blur" : "-z-20"
          } flex justify-center items-center overflow-hidden`}
      >
        <div
          className={`mx-8 md:mx-[unset] p-[40px] bg-white rounded-2xl shadow-xl  transition-all duration-300 ${modal
            ? "bottom-0 md:translate-y-0 -translate-y-[112px]"
            : "bottom-0 translate-y-[1500px] md:translate-y-[1500px]"
            } `}
        >
          <h2 className="text-2xl font-medium">Sign out?</h2>
          <p className="mt-2 mb-6">
            All saved events remain synced to your account.
          </p>
          <div className="flex gap-x-8">
            <Link href={pathName}>
              <button>Not now</button>
            </Link>
            <Link href={pathName}>
              <button
                className="font-medium text-[#1a73e8]"
                onClick={() => {
                  auth.signOut();
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Sign out
              </button>
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}

const getBrowserName = () => {
  var userAgent = navigator.userAgent;
  var browser_names = [
    "Firefox",
    "Chrome",
    "Safari",
    "Edge",
    "Opera",
    "MSIE",
    "OPR",
    "Trident/",
  ];
  var browser_name = "Unknown Browser";

  for (let i = 0; i < browser_names.length; i++) {
    if (userAgent.indexOf(browser_names[i]) > -1) {
      browser_name = browser_names[i];
      return browser_name;
    }
  }
  return browser_name;
};



export function TopNavigationBar(props: any) {
  const router = useRouter();
  const user = useAuthContext();
  const pathName = usePathname();
  const [userProgress, setUserProgress] = useState<Progress | null>(null);

  // Fetch user progress from Firestore instead of localStorage
  useEffect(() => {
    if (user?.uid) {
      GetUserProgress(user.uid).then(setUserProgress);
    } else {
      setUserProgress(null);
    }
  }, [user]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if profile exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        //TODO: setShowProfileModal(true);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <div
      className={`h-14 md:h-16 px-0 md:px-4 flex justify-end items-center w-max ${props.className}`}
    >
      {user !== null && user.photoURL !== null && (
        <Link href="/profile">
          <img
            referrerPolicy="no-referrer"
            src={user.photoURL}
            className="my-3 mx-2 w-[42px] h-[42px] rounded-full aspect-square"
            onClick={() => { }}
          />
        </Link>
        // <Link href="?signout">
        //   <img
        //     referrerPolicy="no-referrer"
        //     src={user.photoURL}
        //     className="my-3 mx-2 w-[42px] h-[42px] rounded-full aspect-square"
        //     onClick={() => {}}
        //   />
        // </Link>
      )}
      {user !== null && user.photoURL === null && (
        <Link href="?signout">
          <div className="my-3 mx-2 w-[42px] h-[42px] rounded-full aspect-square flex items-center justify-center bg-[#fbbc04] font-medium">
            {user?.displayName?.toString().charAt(0).toUpperCase()}
          </div>
        </Link>
      )}
      {/* Show "Confirm Participation" button if user paid but not in team yet */}
      {user !== null &&
        !pathName.includes("/register") &&
        !pathName.includes("/confirmation") &&
        userProgress === Progress.notYetTeamMember && (
          <Link href="/confirmation" className="flex">
            <button className="my-3 md:mx-3 mr-0 ml-3 py-[10px] bg-[#1a73e8] text-white font-medium text-sm px-5 rounded-lg">
              Confirm Participation
            </button>
          </Link>
        )}
      {/* Show "My Profile" if user is fully registered with team */}
      {user !== null &&
        !pathName.includes("/register") &&
        (userProgress === Progress.completeRegistration ||
          userProgress === Progress.completeRegistrationTeamLead) && (
          <Link href="/profile" className="flex">
            <button className="my-3 md:mx-3 mr-0 ml-3 py-[10px] bg-[#1a73e8] text-white font-medium text-sm px-5 rounded-lg">
              My Profile
            </button>
          </Link>
        )}
      {user === null && (
        <button
          className="py-3 px-2 font-medium text-[#1a73e8]"
          onClick={() => {
            if (getBrowserName() === "Unknown Browser") {
              alert("Please use your default browser to register for TechSprint.");
            }
            handleSignIn();
          }}
        >
          Sign In
        </button>
      )}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body> */}
      <body className={`text-neutral-600 bg-(--background)`} suppressHydrationWarning>
        <Navbar />
        <AuthContextProvider>
          <>
            <Script
              id="razorpay-checkout-js"
              src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="h-[64px] md:hidden bg-(--background)" />
            <main>
              {children}
              <Suspense>
                <SignOutDialog />
              </Suspense>
            </main>
          </>
        </AuthContextProvider>
      </body>
    </html>
  );
}
