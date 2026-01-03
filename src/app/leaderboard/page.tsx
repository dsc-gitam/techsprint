"use client";
import { db } from "@/lib/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { EmojiEvents, FilterList } from "@mui/icons-material";

interface TeamScore {
  teamCode: string;
  teamName: string;
  classroom: string;
  milestone1: number;
  milestone2: number;
  milestone3: number;
  milestone4: number;
  milestone5: number;
  milestone6: number;
  milestone7: number;
  milestone8: number;
  milestone9: number;
  milestone10: number;
  totalScore: number;
  rank: number;
}

export default function Leaderboard() {
  const [teams, setTeams] = useState<TeamScore[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMilestone, setFilterMilestone] = useState<string>("all");
  const [filterClassroom, setFilterClassroom] = useState<string>("all");
  const [classrooms, setClassrooms] = useState<string[]>([]);

  useEffect(() => {
    // Real-time listener for leaderboard updates
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData: TeamScore[] = [];
      const classroomSet = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Calculate scores for each milestone
        const calculateMilestoneScore = (milestoneData: any) => {
          if (!milestoneData || typeof milestoneData !== 'object') return 0;
          
          let totalScore = 0;
          Object.values(milestoneData).forEach((judgeScores: any) => {
            if (Array.isArray(judgeScores)) {
              // Sum all scores from this judge (includes time bonus at end)
              totalScore += judgeScores.reduce((sum, score) => sum + (Number(score) || 0), 0);
            }
          });
          return totalScore;
        };

        const m1Score = calculateMilestoneScore(data.milestone_one_score);
        const m2Score = calculateMilestoneScore(data.milestone_two_score);
        const m3Score = calculateMilestoneScore(data.milestone_three_score);
        const m4Score = calculateMilestoneScore(data.milestone_four_score);
        const m5Score = calculateMilestoneScore(data.milestone_five_score);
        const m6Score = calculateMilestoneScore(data.milestone_six_score);
        const m7Score = calculateMilestoneScore(data.milestone_seven_score);
        const m8Score = calculateMilestoneScore(data.milestone_eight_score);
        const m9Score = calculateMilestoneScore(data.milestone_nine_score);
        const m10Score = calculateMilestoneScore(data.milestone_ten_score);

        const team: TeamScore = {
          teamCode: data.teamCode || doc.id,
          teamName: data.teamName || "Unknown Team",
          classroom: data.allottedClassroom || "Not Assigned",
          milestone1: m1Score,
          milestone2: m2Score,
          milestone3: m3Score,
          milestone4: m4Score,
          milestone5: m5Score,
          milestone6: m6Score,
          milestone7: m7Score,
          milestone8: m8Score,
          milestone9: m9Score,
          milestone10: m10Score,
          totalScore: m1Score + m2Score + m3Score + m4Score + m5Score + m6Score + m7Score + m8Score + m9Score + m10Score,
          rank: 0,
        };

        teamsData.push(team);
        if (team.classroom !== "Not Assigned") {
          classroomSet.add(team.classroom);
        }
      });

      // Sort by total score and assign ranks
      teamsData.sort((a, b) => b.totalScore - a.totalScore);
      teamsData.forEach((team, index) => {
        team.rank = index + 1;
      });

      setTeams(teamsData);
      setFilteredTeams(teamsData);
      setClassrooms(Array.from(classroomSet).sort());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...teams];

    // Filter by milestone
    if (filterMilestone !== "all") {
      const milestoneKey = `milestone${filterMilestone}` as keyof TeamScore;
      filtered.sort((a, b) => (b[milestoneKey] as number) - (a[milestoneKey] as number));
    }

    // Filter by classroom
    if (filterClassroom !== "all") {
      filtered = filtered.filter((team) => team.classroom === filterClassroom);
    }

    setFilteredTeams(filtered);
  }, [filterMilestone, filterClassroom, teams]);

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
            <EmojiEvents className="text-yellow-500" fontSize="large" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time team rankings across all milestones
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FilterList className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                View by Milestone
              </label>
              <select
                value={filterMilestone}
                onChange={(e) => setFilterMilestone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Milestones (Total Score)</option>
                <option value="1">Milestone 1</option>
                <option value="2">Milestone 2</option>
                <option value="3">Milestone 3</option>
                <option value="4">Milestone 4</option>
                <option value="5">Milestone 5</option>
                <option value="6">Milestone 6</option>
                <option value="7">Milestone 7</option>
                <option value="8">Milestone 8</option>
                <option value="9">Milestone 9</option>
                <option value="10">Milestone 10</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Filter by Classroom
              </label>
              <select
                value={filterClassroom}
                onChange={(e) => setFilterClassroom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Classrooms</option>
                {classrooms.map((classroom) => (
                  <option key={classroom} value={classroom}>
                    {classroom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {filterMilestone === "all" && filterClassroom === "all" && filteredTeams.length >= 3 && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            {/* 2nd Place */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border-2 border-gray-300 dark:border-gray-600 flex flex-col items-center">
              <div className="text-5xl mb-2">🥈</div>
              <div className="text-6xl font-bold text-gray-600 dark:text-gray-400 mb-2">2</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-1">
                {filteredTeams[1].teamName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{filteredTeams[1].classroom}</p>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {filteredTeams[1].totalScore} pts
              </div>
            </div>

            {/* 1st Place */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6 border-4 border-yellow-400 dark:border-yellow-600 flex flex-col items-center transform scale-105">
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-7xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">1</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                {filteredTeams[0].teamName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{filteredTeams[0].classroom}</p>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {filteredTeams[0].totalScore} pts
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 border-2 border-orange-300 dark:border-orange-600 flex flex-col items-center">
              <div className="text-5xl mb-2">🥉</div>
              <div className="text-6xl font-bold text-orange-600 dark:text-orange-400 mb-2">3</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-1">
                {filteredTeams[2].teamName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{filteredTeams[2].classroom}</p>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {filteredTeams[2].totalScore} pts
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Team</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Classroom</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M1</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M2</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M3</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M4</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M5</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M6</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M7</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M8</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M9</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white">M10</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeams.map((team, index) => (
                  <tr
                    key={team.teamCode}
                    className={`${
                      team.rank <= 3 && filterMilestone === "all" && filterClassroom === "all"
                        ? "bg-yellow-50 dark:bg-yellow-900/10"
                        : "bg-white dark:bg-[#0a0a0a]"
                    } hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {team.rank}
                        </span>
                        {team.rank === 1 && filterMilestone === "all" && filterClassroom === "all" && (
                          <span className="text-2xl">🏆</span>
                        )}
                        {team.rank === 2 && filterMilestone === "all" && filterClassroom === "all" && (
                          <span className="text-2xl">🥈</span>
                        )}
                        {team.rank === 3 && filterMilestone === "all" && filterClassroom === "all" && (
                          <span className="text-2xl">🥉</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{team.teamName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{team.teamCode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {team.classroom}
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {team.milestone1}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {team.milestone2}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {team.milestone3}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        {team.milestone4}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
                        {team.milestone5}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {team.milestone6}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                        {team.milestone7}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
                        {team.milestone8}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300">
                        {team.milestone9}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {team.milestone10}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-4 py-2 rounded-lg text-lg font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                        {team.totalScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTeams.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No teams found with the selected filters</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Teams</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{teams.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Classrooms</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{classrooms.length}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Avg Score</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {teams.length > 0 ? Math.round(teams.reduce((sum, t) => sum + t.totalScore, 0) / teams.length) : 0}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Top Score</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {teams.length > 0 ? teams[0].totalScore : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
