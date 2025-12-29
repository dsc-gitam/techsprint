"use client";
import Loader from "@/components/LoadingAnimation/page";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";

import "./style.css";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { set, update } from "firebase/database";
import { useRouter } from "next/navigation";
import {
    and,
    collection,
    doc,
    documentId,
    getCountFromServer,
    getDoc,
    getDocs,
    or,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BadgeOutlined, EmojiEventsOutlined, PeopleOutline } from "@mui/icons-material";

export default function Confirmation() {
    interface Attendee {
        label: string;
        userId: string;
        image: string;
        profession: string;
        lastName: string;
        email: string;
        isPaid: boolean;
        gender: string;
        isTeamMember: number;
    }

    const BASE_URL = "https://wow-2024-server.onrender.com";
    const router = useRouter();
    const user = useAuthContext();
    const [loading, setLoadingState] = useState(false);
    const [isTeamLead, setTeamLead] = useState<boolean | undefined>(true);
    const [team, setTeam] = useState<Attendee[]>([]);
    const [totalUsers, setTotalUsers] = useState<Attendee[]>([]);
    const [teamSearchAutocomplete, setTeamSearchAutocomplete] =
        useState<null | Attendee>(null);
    const [teamName, setTeamName] = useState<string>("");
    const [teamNumber, setTeamNumber] = useState<number>(-1);
    const [github_profile, setGithubProfile] = useState<string>("");
    const [linkedin_profile, setLinkedinProfile] = useState<string>("");
    const [tshirt_size, setTshirtSize] = useState<string>("");
    const [isCompleteRegistration, setIsCompleteRegistration] = useState(false);

    useEffect(() => {
        if (user === null) {
            alert("Please login to register for TechSprint 2026");
            window.location.href = "/";
            return;
        }
        const ref = collection(db, "registrations");
        const refTeam = collection(db, "teams");
        console.log(user.uid.toString());
        getDocs(
            query(
                ref,
                and(
                    where("isTeamLead", "!=", 1),
                    or(where("isTeamMember", "==", 0), where("isTeamMember", "==", -1))
                )
            )
        ).then((snapshot) => {
            const result = snapshot.docs.map((doc) => {
                const r = doc.data();
                return {
                    label: r["firstName"],
                    lastName: r["lastName"],
                    userId: doc.id,
                    image: r["displayPicture"],
                    profession:
                        r["university"] === "Other"
                            ? r["otherUniversity"]
                            : r["university"],
                    email: r["email"],
                    isPaid: r["payment_status"] == "captured",
                    gender: r["gender"],
                    isTeamMember: r["isTeamMember"],
                } as Attendee;
            });
            console.log(result);
            setTotalUsers(result);
        });
        getDocs(
            query(
                refTeam,
                where('participants', 'array-contains', user.uid),
            )
        ).then(async (snapshot) => {
            // console.log(snapshot.docs);
            const teamDetails = snapshot.docs[0].data();
            setTeamName(teamDetails.teamName);
            setTeamNumber(teamDetails.teamNumber);
            const rp = (await Promise.all(teamDetails.participants.map(async (uid: string) => {
                const s = await getDocs(
                    query(
                        ref,
                        where(documentId(), "==", uid),
                    )
                );
                const result = s.docs.map((doc) => {
                    const r = doc.data();
                    return {
                        label: r["firstName"],
                        lastName: r["lastName"],
                        userId: doc.id,
                        image: r["displayPicture"],
                        profession:
                            r["university"] === "Other"
                                ? r["otherUniversity"]
                                : r["university"],
                        email: r["email"],
                        isPaid: r["payment_status"] == "captured",
                        gender: r["gender"],
                        isTeamMember: r["isTeamMember"],
                    } as Attendee;
                });
                return result;
            })) as Attendee[][]).reduce((p, c) => [...p, ...c]);

            // console.log(result);
            setTeam(rp);
        });
    }, [user]);



    return (
        <div className="min-h-screen bg-white dark:bg-[#121212]">
            <div className="flex flex-col justify-center items-center py-[20px] md:py-[60px] px-4 md:px-0">
                <div className="flex flex-col justify-center items-center md:rounded-xl md:border-[1.5px] border-gray-500 dark:border-gray-600 w-full md:w-4/5 max-w-4xl">
                    <div className="w-full md:rounded-t-xl bg-[#FBBC04] flex flex-col md:flex-row p-4 md:p-[20px] pt-6 md:pt-[32px] pb-4 border-gray-500 border-b-[1.5px]">
                        <div className="md:grow md:pt-[30px] md:pl-[40px] pt-[20px] pb-6 md:pb-[unset]">
                            <h1 className="text-2xl md:text-6xl font-bold text-black">You're in.</h1>
                            <h2 className="text-xl md:text-4xl font-medium mt-2 text-black">
                                {teamName} #{teamNumber == -1 ? "" : teamNumber}
                            </h2>

                            <p className="mt-3 text-lg text-black/80">TechSprint 2026</p>
                            <p className="text-black/70">Gandhi Institute of Technology and Management, Visakhapatnam</p>
                        </div>
                        <img
                            src="/gdsc_sc.webp"
                            className="h-32 md:h-56 -scale-x-100 translate-y-1 md:translate-y-2 self-center md:self-auto"
                            alt="GDSC Mascot"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-8 mt-4 px-4 md:px-8 w-full justify-center">
                        {team.map((attendee, index) => (
                            <div key={attendee.userId || index} className="flex flex-col p-5 bg-amber-200 dark:bg-amber-900/80 w-full md:w-auto md:min-w-[220px] rounded-xl shadow-sm">
                                <p className="text-xl md:text-2xl font-medium text-black dark:text-white">{attendee.label}</p>
                                <p className="text-xl md:text-2xl font-medium text-black dark:text-white">
                                    {attendee.lastName}
                                </p>
                                <p className="text-sm text-black/70 dark:text-gray-300 mt-1">
                                    {attendee.gender}
                                </p>
                                <p className="mt-3 text-sm border border-black/30 dark:border-gray-500 text-black/80 dark:text-gray-300 px-3 py-1.5 rounded-full w-fit">
                                    {attendee.email}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="w-full flex justify-center items-center mb-8">
                        <button
                            onClick={() => router.push('/edit-team')}
                            className="py-2 px-6 text-blue-500 dark:text-blue-400 rounded border-neutral-300 dark:border-gray-600 border font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Edit Team
                        </button>
                    </div>

                    {loading && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
                            <div className="px-6 md:px-16 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full text-center">
                                {isCompleteRegistration ? (
                                    <>
                                        <PeopleOutline fontSize="large" className="text-gray-700 dark:text-gray-300" />
                                        <h2 className="text-2xl font-medium mt-4 text-gray-900 dark:text-white">Team Updated.</h2>
                                        <p className="text-sm mt-4 mb-8 text-gray-600 dark:text-gray-300">
                                            Excited to host your team for TechSprint 2026.
                                            <br />
                                            Earn badges and have fun before the event.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setLoadingState(false);
                                                setIsCompleteRegistration(false);
                                                window.location.href = "/";
                                            }}
                                            className="border-2 px-8 py-2.5 rounded-full border-gray-400 dark:border-gray-500 text-gray-700 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Done
                                        </button>
                                    </>
                                ) : (
                                    <div className="py-4">
                                        <Loader />
                                        <p className="font-medium mt-4 text-gray-700 dark:text-gray-300">
                                            Please wait while we process your application.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
