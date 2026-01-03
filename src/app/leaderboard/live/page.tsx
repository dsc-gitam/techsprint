"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { EmojiEvents, Fullscreen, Refresh } from "@mui/icons-material";

interface Team {
  teamName: string;
  teamCode: string;
  allottedClassroom?: string;
  totalScore: number;
  milestone_one_score?: any;
  milestone_two_score?: any;
  milestone_three_score?: any;
  milestone_four_score?: any;
  milestone_five_score?: any;
  milestone_six_score?: any;
  milestone_seven_score?: any;
  milestone_eight_score?: any;
  milestone_nine_score?: any;
  milestone_ten_score?: any;
}

export default function LiveLeaderboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "teams"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData: Team[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Calculate total score across all milestones
        let total = 0;
        for (let i = 1; i <= 10; i++) {
          const milestoneKey = i === 1 ? "milestone_one_score" :
                              i === 2 ? "milestone_two_score" :
                              i === 3 ? "milestone_three_score" :
                              i === 4 ? "milestone_four_score" :
                              i === 5 ? "milestone_five_score" :
                              i === 6 ? "milestone_six_score" :
                              i === 7 ? "milestone_seven_score" :
                              i === 8 ? "milestone_eight_score" :
                              i === 9 ? "milestone_nine_score" :
                              "milestone_ten_score";
          
          const milestoneScores = data[milestoneKey];
          if (milestoneScores && typeof milestoneScores === 'object') {
            Object.values(milestoneScores).forEach((judgeScores: any) => {
              if (Array.isArray(judgeScores)) {
                total += judgeScores.reduce((sum, score) => sum + (score || 0), 0);
              }
            });
          }
        }
        
        teamsData.push({
          teamName: data.teamName,
          teamCode: doc.id,
          allottedClassroom: data.allottedClassroom,
          totalScore: total,
          milestone_one_score: data.milestone_one_score,
          milestone_two_score: data.milestone_two_score,
          milestone_three_score: data.milestone_three_score,
          milestone_four_score: data.milestone_four_score,
          milestone_five_score: data.milestone_five_score,
          milestone_six_score: data.milestone_six_score,
          milestone_seven_score: data.milestone_seven_score,
          milestone_eight_score: data.milestone_eight_score,
          milestone_nine_score: data.milestone_nine_score,
          milestone_ten_score: data.milestone_ten_score,
        });
      });
      
      // Sort by total score
      teamsData.sort((a, b) => b.totalScore - a.totalScore);
      
      setTeams(teamsData);
      setLastUpdate(new Date());
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-2xl font-bold">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <EmojiEvents className="text-yellow-400" style={{ fontSize: "4rem" }} />
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              LEADERBOARD
            </h1>
            <EmojiEvents className="text-yellow-400" style={{ fontSize: "4rem" }} />
          </div>
          <p className="text-2xl text-blue-200">Tech Sprint 3.0 • Live Rankings</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
            >
              <Fullscreen />
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
            <div className="flex items-center gap-2 text-white/80">
              <Refresh className="animate-spin" style={{ animationDuration: "3s" }} />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {teams.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center justify-end">
              <div className="w-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-t-2xl p-6 text-center shadow-2xl">
                <div className="text-6xl mb-2">🥈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1 truncate">{teams[1]?.teamName}</h3>
                <p className="text-lg text-gray-700">{teams[1]?.allottedClassroom || "No classroom"}</p>
                <div className="mt-4">
                  <p className="text-5xl font-bold text-gray-900">{teams[1]?.totalScore}</p>
                  <p className="text-sm text-gray-700">points</p>
                </div>
              </div>
              <div className="w-full h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-b-2xl"></div>
            </div>

            {/* 1st Place (Taller) */}
            <div className="flex flex-col items-center justify-end">
              <div className="w-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-t-2xl p-8 text-center shadow-2xl transform scale-110">
                <div className="text-7xl mb-2 animate-bounce">🏆</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 truncate">{teams[0]?.teamName}</h3>
                <p className="text-xl text-gray-700">{teams[0]?.allottedClassroom || "No classroom"}</p>
                <div className="mt-4">
                  <p className="text-6xl font-bold text-gray-900">{teams[0]?.totalScore}</p>
                  <p className="text-sm text-gray-700">points</p>
                </div>
              </div>
              <div className="w-full h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-b-2xl"></div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center justify-end">
              <div className="w-full bg-gradient-to-br from-orange-300 to-orange-500 rounded-t-2xl p-6 text-center shadow-2xl">
                <div className="text-6xl mb-2">🥉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1 truncate">{teams[2]?.teamName}</h3>
                <p className="text-lg text-gray-700">{teams[2]?.allottedClassroom || "No classroom"}</p>
                <div className="mt-4">
                  <p className="text-5xl font-bold text-gray-900">{teams[2]?.totalScore}</p>
                  <p className="text-sm text-gray-700">points</p>
                </div>
              </div>
              <div className="w-full h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-b-2xl"></div>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/20">
                  <th className="px-6 py-4 text-left text-xl font-bold text-white">Rank</th>
                  <th className="px-6 py-4 text-left text-xl font-bold text-white">Team</th>
                  <th className="px-6 py-4 text-left text-xl font-bold text-white">Classroom</th>
                  <th className="px-6 py-4 text-center text-xl font-bold text-white">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr
                    key={team.teamCode}
                    className={`border-t border-white/10 ${
                      index < 3 ? "bg-white/20" : "bg-white/5"
                    } hover:bg-white/15 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-white">
                          {index + 1}
                        </span>
                        {index === 0 && <span className="text-3xl">🏆</span>}
                        {index === 1 && <span className="text-3xl">🥈</span>}
                        {index === 2 && <span className="text-3xl">🥉</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-2xl font-bold text-white">{team.teamName}</p>
                      <p className="text-lg text-blue-200">{team.teamCode}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xl text-white">{team.allottedClassroom || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-4xl font-bold text-yellow-300">{team.totalScore}</p>
                      <p className="text-sm text-blue-200">points</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 text-center text-white/60">
          <p className="text-xl">
            🎯 Total Teams: <span className="font-bold text-white">{teams.length}</span> •
            🏆 Top Score: <span className="font-bold text-yellow-300">{teams[0]?.totalScore || 0}</span> •
            📊 Updates automatically in real-time
          </p>
        </div>
      </div>
    </div>
  );
}
