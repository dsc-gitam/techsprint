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
                    <h3 className="text-4xl font-bold">Admin Panel</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <a href="/admin/teams" className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors">
                            <h4 className="text-2xl font-bold mb-2">👥 Team Management</h4>
                            <p className="text-blue-100">Create teams and manage payments</p>
                        </a>
                        
                        <a href="/staff/scanner" className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors">
                            <h4 className="text-2xl font-bold mb-2">📱 QR Scanner</h4>
                            <p className="text-green-100">Check-in, swag, and photobooth</p>
                        </a>
                        
                        <a href="/staff/analytics" className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors">
                            <h4 className="text-2xl font-bold mb-2">📊 Analytics</h4>
                            <p className="text-purple-100">View attendance and statistics</p>
                        </a>
                        
                        <a href="/leaderboard" className="p-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors">
                            <h4 className="text-2xl font-bold mb-2">🏆 Leaderboard</h4>
                            <p className="text-yellow-100">View team rankings</p>
                        </a>
                        
                        <div className="p-6 bg-gray-200 dark:bg-gray-800 rounded-xl lg:col-span-2">
                            <h4 className="text-2xl font-bold mb-2">📝 Milestones</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {
                                    milestones.map((milestone) => {
                                        return <a key={milestone.id} href={"/admin/milestones/" + milestone.id} className="block text-blue-600 dark:text-blue-400 hover:underline">{milestone.title}</a>;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}