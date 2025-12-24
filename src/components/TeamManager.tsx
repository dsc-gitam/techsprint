"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

interface TeamManagerProps {
    userUid: string;
    teamId?: string;
    onTeamUpdate: (newTeamId: string) => void;
}

interface TeamMember {
    uid: string;
    displayName: string;
    photoURL: string;
}

interface Team {
    id: string;
    name: string;
    leaderId: string;
    members: string[]; // UIDs
    code: string; // Join code
}

export default function TeamManager({ userUid, teamId, onTeamUpdate }: TeamManagerProps) {
    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [newTeamName, setNewTeamName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (teamId) {
            fetchTeamDetails(teamId);
        }
    }, [teamId]);

    const fetchTeamDetails = async (tid: string) => {
        setLoading(true);
        try {
            const teamDoc = await getDoc(doc(db, "teams", tid));
            if (teamDoc.exists()) {
                const teamData = { id: teamDoc.id, ...teamDoc.data() } as Team;
                setTeam(teamData);

                // Fetch members details
                const memberPromises = teamData.members.map(uid => getDoc(doc(db, "users", uid)));
                const memberDocs = await Promise.all(memberPromises);
                const memberData = memberDocs.map(d => {
                    const data = d.data();
                    return {
                        uid: d.id,
                        displayName: data?.displayName || 'Unknown',
                        photoURL: data?.photoURL || ''
                    };
                });
                setMembers(memberData);
            }
        } catch (err) {
            console.error("Error fetching team:", err);
        }
        setLoading(false);
    };

    const createTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Generate a simple 6-char code
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            const teamRef = await addDoc(collection(db, "teams"), {
                name: newTeamName,
                leaderId: userUid,
                members: [userUid],
                code: code
            });

            // Update user profile
            await updateDoc(doc(db, "users", userUid), {
                teamId: teamRef.id
            });

            onTeamUpdate(teamRef.id);
            fetchTeamDetails(teamRef.id);
        } catch (err) {
            console.error("Error creating team:", err);
            setError("Failed to create team. Please try again.");
        }
        setLoading(false);
    };

    const joinTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Find team by code
            const q = query(collection(db, "teams"), where("code", "==", joinCode.toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("Invalid team code.");
                setLoading(false);
                return;
            }

            const teamDoc = querySnapshot.docs[0];
            const teamData = teamDoc.data();

            if (teamData.members.length >= 4) {
                setError("Team is full (max 4 members).");
                setLoading(false);
                return;
            }

            // Add user to team
            await updateDoc(doc(db, "teams", teamDoc.id), {
                members: arrayUnion(userUid)
            });

            // Update user profile
            await updateDoc(doc(db, "users", userUid), {
                teamId: teamDoc.id
            });

            onTeamUpdate(teamDoc.id);
            fetchTeamDetails(teamDoc.id);
        } catch (err) {
            console.error("Error joining team:", err);
            setError("Failed to join team. Please try again.");
        }
        setLoading(false);
    };

    if (loading && !team) {
        return <div className="p-4 text-center">Loading team info...</div>;
    }

    if (team) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-[var(--foreground)]">{team.name}</h3>
                        <p className="text-gray-500">Team Code: <span className="font-mono font-bold text-[var(--google-blue)] bg-blue-50 px-2 py-1 rounded">{team.code}</span></p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {members.length} / 4 Members
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Team Members</h4>
                    {members.map((member) => (
                        <div key={member.uid} className="flex items-center p-3 bg-gray-50 rounded-xl">
                            {member.photoURL ? (
                                <img src={member.photoURL} alt={member.displayName} className="w-10 h-10 rounded-full mr-3" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                            )}
                            <div>
                                <p className="font-medium">{member.displayName}</p>
                                {member.uid === team.leaderId && <span className="text-xs text-[var(--google-yellow)] font-bold">Leader</span>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-[var(--google-blue)] mb-2">Next Steps</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Complete your pitch deck before Dec 31st.</li>
                        <li>Join the discord server for updates.</li>
                        <li>Prepare for the hackathon on Jan 3rd.</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
            <h3 className="text-xl font-bold mb-6">Team Management</h3>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Team */}
                <div>
                    <h4 className="font-medium text-gray-700 mb-3">Create a New Team</h4>
                    <form onSubmit={createTeam} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Team Name"
                            required
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent bg-white text-[#202124] placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-[var(--google-blue)] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Team'}
                        </button>
                    </form>
                </div>

                <div className="hidden md:block w-px bg-gray-200 mx-auto"></div>

                {/* Join Team */}
                <div>
                    <h4 className="font-medium text-gray-700 mb-3">Join Existing Team</h4>
                    <form onSubmit={joinTeam} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Enter Team Code"
                            required
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--google-green)] focus:border-transparent uppercase bg-white text-[#202124] placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-[var(--google-green)] text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Joining...' : 'Join Team'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
