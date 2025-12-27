"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ProfileModal from './ProfileModal';

export default function Hero() {
    const [user, setUser] = useState<User | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleRegister = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (user) {
            router.push('/dashboard');
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const signedInUser = result.user;

            // Check if profile exists
            const docRef = doc(db, "users", signedInUser.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setShowProfileModal(true);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Error signing in", error);
        }
    };

    return (
        <section className="relative min-h-[calc(100vh-80px)] pb-[36px] flex items-center justify-center overflow-hidden px-4">


            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="mb-6 md:mb-8 inline-block">
                    <span className="px-3 md:px-4 py-1.5 rounded-full border border-(--io-border) bg-white/50 dark:bg-[#121212]/50 backdrop-blur-sm text-xs md:text-sm font-medium text-gray-600 dark:text-white/50">
                        January 3<sup>rd</sup>-4<sup>th</sup>, 2026
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-medium tracking-tight mb-4 md:mb-6 leading-tight">
                    Build the Future
                    <br />at TechSprint
                </h1>

                <p className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-black/80 dark:text-white/80 max-w-3xl mx-auto mb-6 md:mb-10 px-4">
                    Join us for a 24-hour innovation marathon. Create, collaborate, and compete with the best minds using Google's latest technologies.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
                    <button onClick={handleRegister} className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#2563eb] text-white rounded-full text-base md:text-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        Register Now
                    </button>
                    <a href="#about" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-(--background) text-(--foreground) border border-[var(--io-border)] rounded-full text-base md:text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        Learn More
                    </a>
                </div>

            </div>
            <img src="https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2025/05/google_io_personalized_context.jpg" className="absolute top-10 right-4 md:right-20 blur-[0.8px] w-24 h-16 md:w-48 md:h-32 object-cover rounded-xl opacity-50 md:opacity-100" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="hidden md:block absolute bottom-42 right-72 blur-lg w-28 h-18 object-cover rounded-xl" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/210518_1004_3S1A4903_B_1_1.width-1300.jpg" className="absolute top-24 left-56 blur-sm w-36 h-24 object-cover rounded-xl" />
            <img src="https://www.hindustantimes.com/ht-img/img/2024/05/15/1600x900/Google-AI-Showcase-18_1715737614992_1715737643291.jpg" className="-scale-x-100 absolute bottom-10 left-12 w-72 h-48 object-cover rounded-xl" />

            {user && (
                <ProfileModal
                    user={user}
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    onComplete={() => setShowProfileModal(false)}
                />
            )}
        </section>
    );
}
