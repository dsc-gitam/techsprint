"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (error) {
            console.error("Error signing in", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setMobileMenuOpen(false);
            router.push('/');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <>
            <nav className="bg-(--background) sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2"><svg className='w-8 h-6 md:w-10 md:h-8' width="504" height="504" viewBox="0 0 504 504" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M444.659 220.504C467.171 207.749 493.228 219.295 498.604 243.651L498.727 244.229C501.671 258.54 495.24 273.965 482.448 281.42C434.774 309.203 387.042 336.867 339.078 364.106C325.898 371.59 312.542 370.305 300.344 360.99L300.343 360.989C294.111 356.233 290.164 350.706 288.079 344.589C286.001 338.497 285.683 331.551 287.135 323.809C290.43 312.527 297.845 304.843 308.548 298.869L308.547 298.868C327.591 288.24 346.371 277.027 365.128 266.138L365.127 266.137C388.346 252.802 411.466 239.398 434.694 226.166L444.659 220.504Z" fill="#FABC05" stroke="black" strokeWidth="9" />
                                <path d="M298.806 142.521C309.727 132.819 326.301 130.674 339.154 138.025C387.052 165.421 434.876 192.927 482.447 220.845C495.313 228.396 500.905 240.347 499.203 255.239L499.117 255.95C498.113 263.724 495.3 269.906 491.045 274.77C486.808 279.615 480.953 283.362 473.523 285.976C462.103 288.765 451.742 286.187 441.216 279.904C422.488 268.726 403.387 258.067 384.578 247.268C358.11 231.91 331.631 216.703 305.294 201.212C282.991 188.092 279.964 159.754 298.368 142.917L298.806 142.521Z" fill="#109D58" stroke="black" strokeWidth="9" />
                                <path d="M164.575 138.442C177.595 131.028 190.823 131.922 202.919 140.826C209.388 145.589 213.525 151.19 215.743 157.428C217.923 163.558 218.34 170.569 216.967 178.397C216.04 180.449 215.12 182.948 214.453 184.522C213.59 186.56 212.785 188.049 211.813 189.128C207.135 194.32 201.968 199.119 196.353 202.583C177.503 214.206 158.277 225.119 139.038 236.398C122.071 246.038 105.081 255.668 88.1221 265.343C79.3282 270.359 70.8526 275.391 62.1885 280.3L58.4619 282.396C40.5079 292.417 19.363 286.57 9.21191 268.969H9.21094C-0.422102 252.268 5.09845 230.576 22.3037 220.532C69.5919 192.931 116.999 165.533 164.575 138.442Z" fill="#E94436" stroke="black" strokeWidth="9" />
                                <path d="M36.8911 215.636C39.0871 215.365 40.7791 215.318 42.1997 215.621C49.0358 217.077 55.7766 219.15 61.5825 222.281C81.0734 232.792 100.137 243.988 119.523 255.009H119.524C136.356 264.881 153.193 274.783 170.051 284.633V284.632C180.041 290.47 189.837 295.938 199.647 301.792V301.791C217.304 312.332 222.813 333.566 212.645 351.156V351.157C203.147 367.591 182.123 373.725 164.965 364.488L164.152 364.036L146.327 353.844C104.749 330.04 63.2664 306.073 21.9233 281.873C8.99308 274.304 3.15327 262.401 4.81689 247.474C5.70649 239.489 8.48863 233.105 12.7817 228.065C17.0004 223.113 22.8619 219.245 30.3276 216.52C32.5694 216.298 35.192 215.846 36.8911 215.636Z" fill="#4385F3" stroke="black" strokeWidth="9" />
                            </svg>

                                <span className="text-lg md:text-xl font-bold text-(--foreground) relative">
                                    TechSprint
                                </span>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/#about" className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors">
                                About
                            </Link>
                            <Link href="/timeline" className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors">
                                Timeline
                            </Link>
                            <Link href="/schedule" className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors">
                                Schedule
                            </Link>
                            <Link href="/team" className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors">
                                Team
                            </Link>
                            <Link href="/faq" className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors">
                                FAQ
                            </Link>
                            {user && (
                                <Link href="/dashboard" className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            {/* <Link href="/leaderboard" className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors">
                                Leaderboard
                            </Link> */}

                            {user ? (
                                <div className="flex items-center gap-4">
                                    {user.photoURL && (
                                        <Link href="/dashboard"><img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="size-8 rounded-full border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all"
                                        /></Link>
                                    )}
                                    <button
                                        onClick={handleSignOut}
                                        className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSignIn}
                                    className="bg-[#2563eb] text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col space-y-3">
                                <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors px-2 py-2">
                                    About
                                </Link>
                                <Link href="/timeline" onClick={() => setMobileMenuOpen(false)} className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors px-2 py-2">
                                    Timeline
                                </Link>
                                <Link href="/schedule" onClick={() => setMobileMenuOpen(false)} className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors px-2 py-2">
                                    Schedule
                                </Link>
                                <Link href="/team" onClick={() => setMobileMenuOpen(false)} className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors px-2 py-2">
                                    Team
                                </Link>
                                <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors px-2 py-2">
                                    FAQ
                                </Link>

                                {user ? (
                                    <>
                                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-2">
                                            {user.photoURL && (
                                                <img
                                                    src={user.photoURL}
                                                    alt="Profile"
                                                    className="size-8 rounded-full border border-gray-200"
                                                />
                                            )}
                                            <span className="text-black/60 dark:text-white/70 font-medium">Dashboard</span>
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="text-black/60 dark:text-white/70 hover:text-(--google-blue) font-medium transition-colors px-2 py-2 text-left w-full"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleSignIn();
                                        }}
                                        className="bg-[#2563eb] text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all text-center"
                                    >
                                        Sign in
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

        </>
    );
}
