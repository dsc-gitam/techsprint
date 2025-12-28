"use client"
import { useEffect, useState } from "react";
import Loader from "@/components/LoadingAnimation/page";
import { auth, db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { getDoc, doc, documentId } from "firebase/firestore";
import milestones from "@/data/milestones.json";

import dynamic from 'next/dynamic';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Page() {

    const user = useAuthContext();
    const [loading, setLoadingState] = useState(true);
    const [isvolunteer, setVolunteerState] = useState(false);
    const [isstaff, setStaffState] = useState(false);
    useEffect(() => {
        if (user === null) {
            alert("Please login to register for TechSprint");
            window.location.href = "/";
            return;
        }
        getDoc(doc(db, "registrations", user!.uid)).then((document) => {
            const response = document.data();
            if (response == undefined) {
                alert("Please login to register for TechSprint");
                window.location.href = "/";
                return
            }
            if (response.role === "staff") {
                setLoadingState(false);
                setStaffState(true);
            } else {
                alert("Please login as admin");
                window.location.href = "/";
                return;
            }

        })
    }, [user]);
    return (
        <>
            {
                isstaff && <div className="flex flex-col p-8 gap-8">
                    <h3 className="text-4xl font-bold">Milestones</h3>
                    {
                        milestones.map((milestone) => {
                            return <a href={"/admin/milestones/" + milestone.id}>{milestone.title}</a>;
                        })
                    }

                </div>
            }
        </>
    )
}