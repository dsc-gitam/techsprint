"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Gavel, PersonAdd, Close, CheckCircle } from "@mui/icons-material";

interface Judge {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  assignedTeams: string[];
}

interface Team {
  teamCode: string;
  teamName: string;
  assignedJudges: string[];
}

export default function JudgeAssignments() {
  const user = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedJudge, setSelectedJudge] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  useEffect(() => {
    if (user === null) {
      alert("Please login to access this page");
      router.push("/");
      return;
    }

    getDoc(doc(db, "registrations", user.uid)).then(async (document) => {
      const response = document.data();
      if (response?.role !== "admin") {
        alert("Access denied. Admin privileges required.");
        router.push("/");
      } else {
        await fetchData();
        setLoading(false);
      }
    });
  }, [user, router]);

  const fetchData = async () => {
    // Fetch all judges
    const judgesQuery = query(
      collection(db, "registrations"),
      where("role", "==", "judge")
    );
    const judgesSnapshot = await getDocs(judgesQuery);
    const judgesData: Judge[] = [];
    judgesSnapshot.forEach((doc) => {
      const data = doc.data();
      judgesData.push({
        uid: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        assignedTeams: data.assignedTeams || [],
      });
    });
    setJudges(judgesData);

    // Fetch all teams
    const teamsSnapshot = await getDocs(collection(db, "teams"));
    const teamsData: Team[] = [];
    teamsSnapshot.forEach((doc) => {
      const data = doc.data();
      teamsData.push({
        teamCode: doc.id,
        teamName: data.teamName,
        assignedJudges: data.assignedJudges || [],
      });
    });
    setTeams(teamsData);
  };

  const assignTeamToJudge = async () => {
    if (!selectedJudge || !selectedTeam) {
      alert("Please select both judge and team");
      return;
    }

    try {
      // Add team to judge's assignedTeams
      await updateDoc(doc(db, "registrations", selectedJudge), {
        assignedTeams: arrayUnion(selectedTeam),
      });

      // Add judge to team's assignedJudges
      await updateDoc(doc(db, "teams", selectedTeam), {
        assignedJudges: arrayUnion(selectedJudge),
      });

      alert("✅ Team assigned to judge successfully!");
      await fetchData();
      setSelectedJudge("");
      setSelectedTeam("");
    } catch (error) {
      console.error("Error assigning team:", error);
      alert("Failed to assign team. Please try again.");
    }
  };

  const removeTeamFromJudge = async (judgeUid: string, teamCode: string) => {
    try {
      // Remove team from judge's assignedTeams
      await updateDoc(doc(db, "registrations", judgeUid), {
        assignedTeams: arrayRemove(teamCode),
      });

      // Remove judge from team's assignedJudges
      await updateDoc(doc(db, "teams", teamCode), {
        assignedJudges: arrayRemove(judgeUid),
      });

      alert("✅ Assignment removed successfully!");
      await fetchData();
    } catch (error) {
      console.error("Error removing assignment:", error);
      alert("Failed to remove assignment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gavel className="text-blue-500" fontSize="large" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Judge Team Assignments
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Assign teams to judges for milestone evaluation
          </p>
        </div>

        {/* Assignment Form */}
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Create New Assignment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Judge
              </label>
              <select
                value={selectedJudge}
                onChange={(e) => setSelectedJudge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
              >
                <option value="">-- Select Judge --</option>
                {judges.map((judge) => (
                  <option key={judge.uid} value={judge.uid}>
                    {judge.firstName} {judge.lastName} ({judge.assignedTeams.length} teams)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
              >
                <option value="">-- Select Team --</option>
                {teams.map((team) => (
                  <option key={team.teamCode} value={team.teamCode}>
                    {team.teamName} ({team.assignedJudges.length} judges)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={assignTeamToJudge}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <PersonAdd />
                Assign
              </button>
            </div>
          </div>
        </div>

        {/* Judges List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Judge Assignments ({judges.length} judges)
          </h2>
          
          {judges.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                No judges found
              </p>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                To create judges, go to registrations and set role: "judge"
              </p>
            </div>
          )}

          {judges.map((judge) => (
            <div
              key={judge.uid}
              className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {judge.firstName} {judge.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{judge.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {judge.assignedTeams.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Teams Assigned</p>
                </div>
              </div>

              {judge.assignedTeams.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No teams assigned yet
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {judge.assignedTeams.map((teamCode) => {
                    const team = teams.find((t) => t.teamCode === teamCode);
                    return (
                      <div
                        key={teamCode}
                        className="bg-white dark:bg-[#0a0a0a] rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {team?.teamName || teamCode}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Code: {teamCode}
                          </p>
                        </div>
                        <button
                          onClick={() => removeTeamFromJudge(judge.uid, teamCode)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove assignment"
                        >
                          <Close fontSize="small" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Teams Overview */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Teams Overview ({teams.length} teams)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.teamCode}
                className="bg-gray-50 dark:bg-[#141414] rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {team.teamName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {team.teamCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {team.assignedJudges.length}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Judges</p>
                  </div>
                </div>
                {team.assignedJudges.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    No judges assigned
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {team.assignedJudges.map((judgeUid) => {
                      const judge = judges.find((j) => j.uid === judgeUid);
                      return (
                        <span
                          key={judgeUid}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full"
                        >
                          {judge?.firstName || "Unknown"}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
