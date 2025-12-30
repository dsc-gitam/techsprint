"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import GetUserProgress from '@/utils/getUserProgress';
import Progress from '@/utils/progress';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import MapOutlined from '@mui/icons-material/MapOutlined';

export default function Hero() {
    const [user, setUser] = useState<User | null>(null);
    const [userProgress, setUserProgress] = useState<Progress | null>(null);
    const [loading, setLoading] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const progress = await GetUserProgress(currentUser.uid);
                setUserProgress(progress);
            } else {
                setUserProgress(null);
            }
            setLoading(false);
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
            router.push('/dashboard');
        } catch (error) {
            console.error("Error signing in", error);
        }
    };

    const getButtonText = () => {
        if (!user) return "Register Now";
        if (loading) return "Loading...";

        switch (userProgress) {
            case Progress.noApplication:
                return "Register Now";
            case Progress.paymentPending:
            case Progress.incompleteRegistration:
            case Progress.notYetTeamMember:
                return "Complete Registration";
            case Progress.completeRegistration:
            case Progress.completeRegistrationTeamLead:
                return "You're In ✓";
            default:
                return "Register Now";
        }
    };

    const getButtonStyle = () => {
        if (userProgress === Progress.completeRegistration ||
            userProgress === Progress.completeRegistrationTeamLead) {
            return "w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-green-500 text-white rounded-full text-base md:text-lg font-medium cursor-default";
        }
        return "w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#2563eb] text-white rounded-full text-base md:text-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer";
    };

    const isRegistered = userProgress === Progress.completeRegistration ||
        userProgress === Progress.completeRegistrationTeamLead;

    return (
        <section className="relative min-h-[calc(100vh-80px)] pb-[36px] flex items-center justify-center overflow-hidden px-4">


            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="mb-6 md:mb-8 inline-block">
                    <span className="px-3 md:px-4 py-1.5 rounded-full border border-(--io-border) bg-white/50 dark:bg-[#121212]/50 backdrop-blur-sm text-xs md:text-sm font-medium text-gray-600 dark:text-white/50">
                        Building Good Things Together
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-medium tracking-tight mb-4 md:mb-6 leading-tight">
                    Build the Future
                    <br />at TechSprint
                </h1>

                <p className="my-5 flex flex-wrap gap-y-2 md:justify-center text-center justify-center">
                    <span className="mr-4 flex items-center">
                        <span className="mr-1">
                            <CalendarMonth />
                        </span>{" "}
                        January 3-4th, 2026
                    </span>
                    <span className="mr-4 flex items-center">
                        <span className="mr-1">
                            <MapOutlined />
                        </span>
                        <a
                            href={"https://maps.google.com?q=Chandrahas%20Bhavan,%20Q9JG+5FF,%20RUSHIKONDA,%20GITAM,%20Rushikonda,%20Visakhapatnam,%20Andhra%20Pradesh%20530045&ftid=0x0:0x6c1c27dfb649611a&entry=gps&lucs=,94297699,94275415,94284508,94231188,94280568,47071704,94218641,94282134,94286869&g_st=ic"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black"
                            className="text-black underline-offset-2 dark:text-white"
                        >
                            GITAM (Deemed to be University)
                        </a>
                    </span>
                </p>

                <p className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-black/80 dark:text-white/80 max-w-3xl mx-auto mb-6 md:mb-10 px-4">
                    Join us for a 24-hour innovation marathon. Create, collaborate, and compete with the best minds using Google's latest technologies.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
                    <button
                        onClick={isRegistered ? undefined : handleRegister}
                        className={getButtonStyle()}
                        disabled={isRegistered}
                    >
                        {getButtonText()}
                    </button>
                    <a href="#about" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-(--background) text-(--foreground) border border-[var(--io-border)] rounded-full text-base md:text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        Learn More
                    </a>
                    {/* <a href="https://www.google.com/maps/place/I.C.T+BHAVAN/@17.780655,83.3750075,18.16z/data=!4m6!3m5!1s0x3a395b1ce07ef447:0x2d3bc5abd9fa0c49!8m2!3d17.7804343!4d83.3761856!16s%2Fg%2F11cjnnm2kb?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-(--background) text-(--foreground) border border-[var(--io-border)] rounded-full text-base md:text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        View Location
                    </a> */}
                </div>

            </div>
            <img src="https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2025/05/google_io_personalized_context.jpg" className="absolute top-10 right-4 md:right-20 blur-[0.8px] w-24 h-16 md:w-48 md:h-32 object-cover rounded-xl opacity-50 md:opacity-100" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="hidden md:block absolute bottom-42 right-72 blur-lg w-28 h-18 object-cover rounded-xl" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/210518_1004_3S1A4903_B_1_1.width-1300.jpg" className="absolute top-24 left-56 blur-sm w-36 h-24 object-cover rounded-xl" />
            <img src="https://www.hindustantimes.com/ht-img/img/2024/05/15/1600x900/Google-AI-Showcase-18_1715737614992_1715737643291.jpg" className="-scale-x-100 absolute bottom-10 left-12 w-72 h-48 object-cover rounded-xl" />
        </section>
    );
}
