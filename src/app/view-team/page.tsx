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
        <div className="flex flex-col justify-center items-center py-[20px] md:py-[60px] md:px-[unset]">
            <div className="flex flex-col justify-center items-center md:rounded-xl md:border-[1.5px] border-gray-500 md:w-4/5">
                <div className="w-full md:rounded-t-xl bg-[#FBBC04] flex flex-col md:flex-row p-[20px] pt-[32px] pb-4 border-gray-500 border-b-[1.5px]">
                    <div className="md:grow md:pt-[30px] md:pl-[40px] pt-[20px] pb-[40px] md:pb-[unset]">
                        <h1 className="text-2xl md:text-6xl font-bold">You're in.</h1>
                        <h2 className="text-xl md:text-4xl font-medium mt-2">
                            {teamName} #{teamNumber == -1 ? "" : teamNumber}
                        </h2>

                        <p className="mt-3 text-lg">TechSprint 2026</p>
                        <p>Vignan's Institute of Information Technology, Visakhapatnam</p>
                    </div>
                    <img
                        src="gdsc_sc.webp"
                        className="md:h-56 -scale-x-100 translate-y-1 md:translate-y-2"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-x-4 mb-8 mt-4">
                    {team.map((attendee, index) => (
                        <div className="inline-flex flex-col p-[20px] bg-amber-200 w-max mt-3 rounded-xl">
                            <p className="text-2xl font-medium">{attendee.label}</p>
                            <p className="text-2xl font-medium">
                                {attendee.lastName}
                            </p>
                            <p className="text-sm">
                                {attendee.gender}
                            </p>
                            <p className="mt-2 text-sm border-[1px] border-black px-3 py-1 rounded-full">
                                {attendee.email}
                            </p>

                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="absolute top-0 w-full h-full flex items-center justify-center z-10 bg-opacity-50 bg-black md:ml-[80px] text-center">
                        <div className="px-[40px] md:px-[80px] pb-[40px] bg-white rounded-2xl shadow-2xl mx-8 md:mx-[unset]">
                            {isCompleteRegistration ? (
                                <>
                                    <PeopleOutline fontSize="large" className="mt-8" />
                                    <h2 className="text-2xl font-medium mt-4">Team Updated.</h2>
                                    <p className="text-sm mt-4 mb-8 max-w-[420px]">
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
                                        className="border-[1.5px] px-8 py-2 rounded-full border-gray-500"
                                    >
                                        Done
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Loader></Loader>
                                    <p className="font-medium">
                                        Please wait while we process your application.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
