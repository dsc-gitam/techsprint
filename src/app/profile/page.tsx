"use client";
import { getDoc, doc, query, collection, where, getDocs, documentId, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import QRCode from "react-qr-code";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentCopy, PeopleOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface TeamMember {
  label: string;
  lastName: string;
  userId: string;
  image: string;
  profession: string;
  email: string;
  gender: string;
}

export default function Profile() {
  const user = useAuthContext();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(undefined);
  const [teamData, setTeamData] = useState<any>(undefined);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  
  // Problem statement states
  const [problemStatement, setProblemStatement] = useState("");
  const [solution, setSolution] = useState("");
  const [techStack, setTechStack] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditingProblem, setIsEditingProblem] = useState(false);
  const [hasProblemStatement, setHasProblemStatement] = useState(false);
  const [joinTeamCode, setJoinTeamCode] = useState("");
  const [joining, setJoining] = useState(false);
  
  // Check if editing is allowed (until Jan 2nd, 3PM 2026)
  const isEditingAllowed = new Date() < new Date('2026-01-02T15:00:00');
  
  useEffect(() => {
    if (user == null || user === undefined) {
      return;
    }
    getDoc(doc(db, "registrations", user.uid)).then(async (document) => {
      const response = document.data();
      setUserData(response);
      
      // If user has a team code, fetch team data
      if (response?.teamCode) {
        const teamDoc = await getDoc(doc(db, "teams", response.teamCode));
        if (teamDoc.exists()) {
          const teamInfo = teamDoc.data();
          setTeamData(teamInfo);

          // Load problem statement from team
          if (teamInfo.problemStatement) {
            setProblemStatement(teamInfo.problemStatement);
            setSolution(teamInfo.solution || "");
            setTechStack(teamInfo.techStack || "");
            setHasProblemStatement(true);
          }
          
          // Fetch all team members
          const membersData = await Promise.all(
            teamInfo.memberIds.map(async (uid: string) => {
              const memberDoc = await getDoc(doc(db, "registrations", uid));
              if (memberDoc.exists()) {
                const r = memberDoc.data();
                return {
                  label: r.firstName,
                  lastName: r.lastName,
                  userId: memberDoc.id,
                  image: r.displayPicture,
                  profession: r.university === "Other" ? r.otherUniversity : r.university,
                  email: r.email,
                  gender: r.gender,
                } as TeamMember;
              }
              return null;
            })
          );
          setTeamMembers(membersData.filter((m) => m !== null) as TeamMember[]);
        }
      }
    });
  }, [user]);

  const handleSaveProblemStatement = async () => {
    if (!user?.uid) return;
    
    // Only leader can edit
    if (userData?.role !== "leader") {
      alert("Only team leaders can edit the problem statement.");
      return;
    }
    
    setSaving(true);
    try {
      // Save to team document
      if (userData?.teamCode) {
        await updateDoc(doc(db, "teams", userData.teamCode), {
          problemStatement,
          solution,
          techStack,
        });
      }

      setHasProblemStatement(true);
      setIsEditingProblem(false);
      alert("Problem statement saved successfully!");
    } catch (error) {
      console.error("Error saving problem statement:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT SIDE - Profile Info & QR Code */}
          <div className="flex flex-col items-center space-y-6">
            {user !== null && user.photoURL !== null && userData != undefined && (
              <>
                <div className="w-full flex flex-col items-center bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full"
                  />
                  <p className="text-xl mt-3 font-medium text-gray-900 dark:text-white">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <p className="text-base text-gray-600 dark:text-gray-400">{userData.university}</p>
                  <p
                    className={`text-sm mt-1 ${
                      userData.gender === "He/Him" ? "text-blue-500" : "text-pink-500"
                    }`}
                  >
                    {userData.gender}
                  </p>
                  
                  {/* Team Referral Code Section for Team Leads */}

                </div>
                
                {/* QR Code Section */}
                <div className="w-full bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">Your QR Code</p>
                  <div className="flex justify-center">
                    <QRCode
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={user?.uid ?? ""}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
                
                <Link href="?signout" className="w-full">
                  <div className="w-full text-center border-2 border-red-300 dark:border-red-500 rounded-xl text-red-500 px-4 py-3 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Sign Out
                  </div>
                </Link>
              </>
            )}
          </div>
          
          {/* RIGHT SIDE - Problem Statement & Team View */}
          <div className="flex flex-col space-y-6">
            
            {/* Problem Statement Form */}
            <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Problem Statement</h2>
                {hasProblemStatement && !isEditingProblem && isEditingAllowed && userData?.role === "leader" && (
                  <button
                    onClick={() => setIsEditingProblem(true)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {userData?.role === "leader" && (!hasProblemStatement || isEditingProblem) ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Problem Statement Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      placeholder="Describe the problem you're solving"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Solution Description
                    </label>
                    <textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="Describe your solution (optional)"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Tech Stack
                    </label>
                    <input
                      type="text"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      placeholder="e.g., React, Node.js, Firebase (optional)"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProblemStatement}
                      disabled={saving || !problemStatement}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? "Saving..." : "Save Problem Statement"}
                    </button>
                    {isEditingProblem && (
                      <button
                        onClick={() => setIsEditingProblem(false)}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  {!isEditingAllowed && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                      ⚠️ Editing is no longer allowed after January 1st, 2026
                    </p>
                  )}
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Problem Statement Description
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {problemStatement || "Not set"}
                    </p>
                  </div>
                  
                  {solution && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Solution Description
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                        {solution}
                      </p>
                    </div>
                  )}
                  
                  {techStack && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Tech Stack
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {techStack}
                      </p>
                    </div>
                  )}
                  
                  {!isEditingAllowed && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        ℹ️ Problem statement editing closed on January 1st, 2026
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Join Team Section - Removed, team assignment is now handled by admin */}
            {/* Team View Section */}
            {userData?.teamCode && teamData && (
              <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Team</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {teamData.teamName} (Code: {teamData.teamCode})
                    </p>
                    {teamData.allottedClassroom && (
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                        📍 Classroom: {teamData.allottedClassroom}
                      </p>
                    )}
                  </div>
                  <PeopleOutline className="text-gray-400" fontSize="large" />
                </div>
                
                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <div
                      key={member.userId}
                      className="p-4 bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={member.image}
                          className="w-12 h-12 rounded-full"
                          alt={member.label}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.label} {member.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{member.profession}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{member.email}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            member.gender === "He/Him"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                          }`}
                        >
                          {member.gender}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Team Message */}
            {!userData?.teamCode && (
              <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Team Status</h2>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-center font-medium text-amber-800 dark:text-amber-200">
                    ℹ️ You are not assigned to a team yet. Contact admin for team assignment.
                  </p>
                </div>
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
