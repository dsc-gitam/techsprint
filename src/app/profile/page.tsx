"use client";
import { getDoc, doc, query, collection, where, getDocs, documentId, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import QRCode from "react-qr-code";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentCopy, CheckCircle, PeopleOutline } from "@mui/icons-material";
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
  const [copied, setCopied] = useState(false);
  
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
      
      // Load problem statement data if exists
      if (response?.problemStatement) {
        setProblemStatement(response.problemStatement);
        setHasProblemStatement(true);
      }
      if (response?.solution) setSolution(response.solution);
      if (response?.techStack) setTechStack(response.techStack);
      
      // If user is a team lead, fetch team data
      if (response?.isTeamLead === 1 && response?.teamName) {
        getDoc(doc(db, "teams", response.teamName)).then((teamDoc) => {
          if (teamDoc.exists()) {
            setTeamData(teamDoc.data());
          }
        });
      }
      
      // Fetch team members if user is in a team
      if (response?.isTeamMember === 1 && response?.teamName) {
        const teamDoc = await getDoc(doc(db, "teams", response.teamName));
        if (teamDoc.exists()) {
          const teamInfo = teamDoc.data();
          setTeamData(teamInfo);

          // Fetch problem statement for team members
          if (!response?.problemStatement) {
            if (teamInfo.problemStatement) {
              setProblemStatement(teamInfo.problemStatement);
              setSolution(teamInfo.solution || "");
              setTechStack(teamInfo.techStack || "");
              setHasProblemStatement(true);
            } else if (teamInfo.leaderId) {
              // Fallback: Fetch from leader's profile if not on team doc
              const leaderDoc = await getDoc(doc(db, "registrations", teamInfo.leaderId));
              if (leaderDoc.exists()) {
                const leaderData = leaderDoc.data();
                if (leaderData.problemStatement) {
                  setProblemStatement(leaderData.problemStatement);
                  setSolution(leaderData.solution || "");
                  setTechStack(leaderData.techStack || "");
                  setHasProblemStatement(true);
                }
              }
            }
          }
          
          // Fetch all team members
          const membersData = await Promise.all(
            teamInfo.participants.map(async (uid: string) => {
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

  const copyToClipboard = () => {
    if (teamData?.referralCode) {
      navigator.clipboard.writeText(teamData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralCode = () => {
    if (!teamData?.referralCode || !teamData?.teamName) return;
    
    const shareLink = `${window.location.origin}/register?code=${teamData.referralCode}`;
    const shareText = `Join my team "${teamData.teamName}" for TechSprint 2026!\n\nClick here to register and join: ${shareLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Join my TechSprint team!",
        text: shareText,
      }).catch(() => {
        // Fallback to copying the link
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Copy the link
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveProblemStatement = async () => {
    if (!user?.uid) return;
    
    setSaving(true);
    try {
      // Save to user profile (legacy support)
      await updateDoc(doc(db, "registrations", user.uid), {
        problemStatement,
        solution,
        techStack,
      });

      // Save to team document (so all members can see it)
      if (userData?.teamName) {
        await updateDoc(doc(db, "teams", userData.teamName), {
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

  const handleJoinTeam = async () => {
    if (!user?.uid || !joinTeamCode) return;
    
    setJoining(true);
    try {
      const teamsRef = collection(db, "teams");
      const teamQuery = query(teamsRef, where("referralCode", "==", joinTeamCode.toUpperCase()));
      const teamSnapshot = await getDocs(teamQuery);

      if (teamSnapshot.empty) {
        alert("Invalid referral code. Please check and try again.");
        setJoining(false);
        return;
      }

      const teamDoc = teamSnapshot.docs[0];
      const teamData = teamDoc.data();
      
      if (teamData.participants && teamData.participants.length >= 5) {
        alert("This team is full (maximum 5 members).");
        setJoining(false);
        return;
      }

      if (teamData.participants && teamData.participants.includes(user.uid)) {
        alert("You are already in this team!");
        setJoining(false);
        return;
      }

      await updateDoc(doc(db, "teams", teamDoc.id), {
        participants: arrayUnion(user.uid),
      });

      await updateDoc(doc(db, "registrations", user.uid), {
        isTeamMember: 1,
        teamName: teamData.teamName,
      });

      alert("Successfully joined team!");
      window.location.reload();
    } catch (error) {
      console.error("Error joining team:", error);
      alert("Failed to join team. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!user?.uid || !teamData?.teamName) return;
    
    if (!confirm("Are you sure you want to leave this team?")) return;

    setJoining(true);
    try {
      await updateDoc(doc(db, "teams", teamData.teamName), {
        participants: arrayRemove(user.uid),
      });

      await updateDoc(doc(db, "registrations", user.uid), {
        isTeamMember: 0,
        teamName: "",
      });

      alert("Successfully left the team.");
      window.location.reload();
    } catch (error) {
      console.error("Error leaving team:", error);
      alert("Failed to leave team. Please try again.");
    } finally {
      setJoining(false);
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
                  {userData.isTeamLead === 1 && teamData?.referralCode && (
                    <div className="mt-4 w-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team: {teamData.teamName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Share this code with your friends to join them in you team</p>
                      
                      {/* Referral Code Display */}
                      <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-white dark:bg-[#0a0a0a] rounded-lg border border-blue-300 dark:border-blue-700">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-widest">{teamData.referralCode}</p>
                        <button
                          onClick={copyToClipboard}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                          title="Copy code"
                        >
                          {copied ? (
                            <CheckCircle className="text-green-500" fontSize="small" />
                          ) : (
                            <ContentCopy className="text-blue-600 dark:text-blue-400" fontSize="small" />
                          )}
                        </button>
                      </div>
                      
                      {/* Registration Link Display */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Direct Registration Link:</p>
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-300 dark:border-gray-600">
                          <input
                            type="text"
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?code=${teamData.referralCode}`}
                            readOnly
                            className="flex-1 text-xs bg-transparent text-gray-700 dark:text-gray-300 outline-none select-all"
                            onClick={(e) => e.currentTarget.select()}
                          />
                          <button
                            onClick={shareReferralCode}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors shrink-0"
                            title="Copy link"
                          >
                            <ContentCopy className="text-gray-600 dark:text-gray-400" fontSize="small" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          💡 Click the link to select and copy, or click the copy button
                        </p>
                      </div>
                    </div>
                  )}
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
                {hasProblemStatement && !isEditingProblem && isEditingAllowed && userData?.isTeamLead === 1 && (
                  <button
                    onClick={() => setIsEditingProblem(true)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {userData?.isTeamLead === 1 && (!hasProblemStatement || isEditingProblem) ? (
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
                  
                  {userData?.isTeamLead !== 1 && userData?.isTeamMember === 1 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        ℹ️ Only the Team Lead can edit the problem statement.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Join Team Section */}
            {userData?.isTeamMember !== 1 && (
              <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Join a Team</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Enter Referral Code
                    </label>
                    <input
                      type="text"
                      value={joinTeamCode}
                      onChange={(e) => setJoinTeamCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleJoinTeam}
                    disabled={joining || !joinTeamCode}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {joining ? "Joining..." : "Join Team"}
                  </button>
                </div>
              </div>
            )}

            {/* Team View Section */}
            {userData?.isTeamMember === 1 && teamData && (
              <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Team</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {teamData.teamName} #{teamData.teamNumber}
                    </p>
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
                
                {userData?.isTeamLead === 1 && (
                  <button
                    onClick={() => router.push('/edit-team')}
                    className="w-full mt-4 py-2 text-blue-500 dark:text-blue-400 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Edit Team
                  </button>
                )}
                
                {userData?.isTeamLead !== 1 && (
                  <button
                    onClick={handleLeaveTeam}
                    disabled={joining}
                    className="w-full mt-4 py-2 text-red-500 dark:text-red-400 rounded-lg border border-red-300 dark:border-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {joining ? "Leaving..." : "Leave Team"}
                  </button>
                )}
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
