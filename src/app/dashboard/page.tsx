"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TeamManager from '@/components/TeamManager';
import Link from 'next/link';

interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    college: string;
    year: string;
    teamId?: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        college: '',
        year: ''
    });
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch profile
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile);
                    setFormData({
                        college: docSnap.data().college || '',
                        year: docSnap.data().year || ''
                    });
                } else {
                    // Create initial profile
                    const newProfile = {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName || '',
                        email: currentUser.email || '',
                        photoURL: currentUser.photoURL || '',
                        college: '',
                        year: ''
                    };
                    await setDoc(docRef, newProfile);
                    setProfile(newProfile);
                    setIsEditing(true); // Force edit to fill details
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                college: formData.college,
                year: formData.year
            });
            setProfile(prev => prev ? ({ ...prev, ...formData }) : null);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <nav className="bg-white border-b border-[#e8eaed]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2"><svg className='w-10 h-8' width="504" height="504" viewBox="0 0 504 504" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M444.659 220.504C467.171 207.749 493.228 219.295 498.604 243.651L498.727 244.229C501.671 258.54 495.24 273.965 482.448 281.42C434.774 309.203 387.042 336.867 339.078 364.106C325.898 371.59 312.542 370.305 300.344 360.99L300.343 360.989C294.111 356.233 290.164 350.706 288.079 344.589C286.001 338.497 285.683 331.551 287.135 323.809C290.43 312.527 297.845 304.843 308.548 298.869L308.547 298.868C327.591 288.24 346.371 277.027 365.128 266.138L365.127 266.137C388.346 252.802 411.466 239.398 434.694 226.166L444.659 220.504Z" fill="#FABC05" stroke="black" strokeWidth="9" />
                                <path d="M298.806 142.521C309.727 132.819 326.301 130.674 339.154 138.025C387.052 165.421 434.876 192.927 482.447 220.845C495.313 228.396 500.905 240.347 499.203 255.239L499.117 255.95C498.113 263.724 495.3 269.906 491.045 274.77C486.808 279.615 480.953 283.362 473.523 285.976C462.103 288.765 451.742 286.187 441.216 279.904C422.488 268.726 403.387 258.067 384.578 247.268C358.11 231.91 331.631 216.703 305.294 201.212C282.991 188.092 279.964 159.754 298.368 142.917L298.806 142.521Z" fill="#109D58" stroke="black" strokeWidth="9" />
                                <path d="M164.575 138.442C177.595 131.028 190.823 131.922 202.919 140.826C209.388 145.589 213.525 151.19 215.743 157.428C217.923 163.558 218.34 170.569 216.967 178.397C216.04 180.449 215.12 182.948 214.453 184.522C213.59 186.56 212.785 188.049 211.813 189.128C207.135 194.32 201.968 199.119 196.353 202.583C177.503 214.206 158.277 225.119 139.038 236.398C122.071 246.038 105.081 255.668 88.1221 265.343C79.3282 270.359 70.8526 275.391 62.1885 280.3L58.4619 282.396C40.5079 292.417 19.363 286.57 9.21191 268.969H9.21094C-0.422102 252.268 5.09845 230.576 22.3037 220.532C69.5919 192.931 116.999 165.533 164.575 138.442Z" fill="#E94436" stroke="black" strokeWidth="9" />
                                <path d="M36.8911 215.636C39.0871 215.365 40.7791 215.318 42.1997 215.621C49.0358 217.077 55.7766 219.15 61.5825 222.281C81.0734 232.792 100.137 243.988 119.523 255.009H119.524C136.356 264.881 153.193 274.783 170.051 284.633V284.632C180.041 290.47 189.837 295.938 199.647 301.792V301.791C217.304 312.332 222.813 333.566 212.645 351.156V351.157C203.147 367.591 182.123 373.725 164.965 364.488L164.152 364.036L146.327 353.844C104.749 330.04 63.2664 306.073 21.9233 281.873C8.99308 274.304 3.15327 262.401 4.81689 247.474C5.70649 239.489 8.48863 233.105 12.7817 228.065C17.0004 223.113 22.8619 219.245 30.3276 216.52C32.5694 216.298 35.192 215.846 36.8911 215.636Z" fill="#4385F3" stroke="black" strokeWidth="9" />
                            </svg>

                                <span className="text-xl font-bold text-[#202124] relative">
                                    TechS<span>p<div className='absolute -bottom-1 left-[58.5px] w-[2.5px] h-4 bg-[#202124]'></div></span>rint
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <button onClick={handleSignOut} className="text-gray-600 font-medium hover:text-[var(--google-red)]">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 ">
                            <div className="flex flex-col items-center text-center">
                                {profile?.photoURL && (
                                    <img
                                        src={profile.photoURL}
                                        alt={profile.displayName}
                                        className="rounded-full mb-4 size-24"
                                    />
                                )}
                                <h2 className="text-xl font-bold">{profile?.displayName}</h2>
                                <p className="text-gray-500 text-sm mb-4">{profile?.email}</p>

                                {!isEditing ? (
                                    <div className="w-full text-left mt-4 space-y-2">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase">College</p>
                                            <p className="font-medium">{profile?.college || 'Not set'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase">Year of Study</p>
                                            <p className="font-medium">{profile?.year || 'Not set'}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full mt-4 py-2 text-[var(--google-blue)] border border-[var(--google-blue)] rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUpdateProfile} className="w-full mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 text-left mb-1">College Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.college}
                                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent bg-white text-[#202124] placeholder-gray-400"
                                                placeholder="Enter college name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 text-left mb-1">Year of Study</label>
                                            <select
                                                required
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent bg-white text-[#202124]"
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1st Year">1st Year</option>
                                                <option value="2nd Year">2nd Year</option>
                                                <option value="3rd Year">3rd Year</option>
                                                <option value="4th Year">4th Year</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-2 text-white bg-[var(--google-blue)] rounded-lg hover:bg-blue-600"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="col-span-1 md:col-span-2">
                        <TeamManager
                            userUid={user.uid}
                            teamId={profile?.teamId}
                            onTeamUpdate={(newTeamId) => {
                                setProfile(prev => prev ? ({ ...prev, teamId: newTeamId }) : null);
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}