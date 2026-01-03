"use client";
import { useParams } from "next/navigation";
import milestones from "@/data/milestones.json";
import rubrics from "@/data/judging-rubrics.json";
import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { VisibilityOutlined, EmojiEvents, CheckCircle } from "@mui/icons-material";
import { useAuthContext } from "@/context/AuthContext";
import { getDoc } from "firebase/firestore";

export default function Page() {
  const [userResponses, setUserResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [assignedTeams, setAssignedTeams] = useState<string[]>([]);
  const params = useParams();
  const user = useAuthContext();
  
  const data =
    milestones.filter((m) => m.id == params["id"]).length > 0
      ? milestones.filter((m) => m.id == params["id"])[0]
      : undefined;

  useEffect(() => {
    if (user && data?.id != null) {
      // Fetch user role and assigned teams
      getDoc(doc(db, "registrations", user.uid)).then((userDoc) => {
        const userData = userDoc.data();
        const role = userData?.role || "";
        const teams = userData?.assignedTeams || [];
        setUserRole(role);
        setAssignedTeams(teams);
        
        // Fetch milestone data
        fetchMilestonesData(data.id, role, teams).then((pages) => {
          console.log(pages);
          setUserResponses(pages);
          setLoading(false);
        });
      });
    }
  }, [data?.id, user]);

  async function fetchMilestonesData(id: string, role: string, assignedTeams: string[]) {
    var responses: any[] = [];
    const documents = await getDocs(query(collection(db, "teams")));
    const isFinalMilestone = id === "milestone_ten";
    
    documents.forEach((document) => {
      const response = document.data();
      
      // For final milestone (10), require submission
      // For milestones 1-9, show all teams regardless of submission
      const hasSubmission = response[`${id}_link`] != undefined;
      const shouldShow = isFinalMilestone ? hasSubmission : true;
      
      if (shouldShow) {
        // If judge role, only show assigned teams
        if (role === "judge") {
          if (assignedTeams.includes(document.id)) {
            responses = [...responses, { ...document.data(), docId: document.id }];
          }
        } else {
          // Admin and staff see all teams
          responses = [...responses, { ...document.data(), docId: document.id }];
        }
      }
    });
    return responses;
  }

  const handleJudge = async (e: React.FormEvent, teamData: any) => {
    e.preventDefault();
    const fD = new FormData(e.currentTarget as HTMLFormElement);
    
    const scores = rubrics.map((_, index) => parseInt(fD.get(`score-${index + 1}`) as string) || 0);
    
    // Validate scores
    if (scores.some(score => score > 5 || score < 0)) {
      alert("Scores should be between 0 and 5");
      return;
    }

    // Calculate time bonus/penalty only if submission exists (milestone 10)
    let timeBonus = 0;
    const isFinalMilestone = data?.id === "milestone_ten";
    
    if (isFinalMilestone && teamData[`${data?.id}_time`]) {
      const submissionTime = new Date(teamData[`${data?.id}_time`].toDate());
      const deadline = new Date("3 Jan 2026 16:30:00 GMT+0530");
      const timeDiff = (submissionTime.getTime() - deadline.getTime()) / 1000 / 60; // minutes
      
      if (timeDiff < -60) {
        timeBonus = -5; // Early submission penalty
      } else if (timeDiff > 30) {
        timeBonus = 5; // Late submission penalty
      }
    }

    const judgeScore = {
      [user!.uid]: [...scores, timeBonus],
    };

    try {
      await setDoc(
        doc(db, "teams", teamData.docId),
        {
          [`${data?.id}_score`]: {
            ...teamData[`${data?.id}_score`],
            ...judgeScore,
          },
        },
        { merge: true }
      );
      
      alert("Scores submitted successfully!");
      fetchMilestonesData(data!.id, userRole, assignedTeams).then((pages) => {
        setUserResponses(pages);
      });
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("Failed to submit scores. Please try again.");
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
            <EmojiEvents className="text-blue-500" fontSize="large" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                {data?.title.split(": ")[0]}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {data?.title.split(": ")[1]}
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Judge team submissions using the rubric below
          </p>
        </div>

        {/* Rubric Reference Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📋 Judging Rubric (Each criterion: 0-5 points)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rubrics.map((rubric, index) => (
              <div key={rubric.id} className="bg-white dark:bg-[#0a0a0a] rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {index + 1}. {rubric.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {rubric.description}
                </p>
              </div>
            ))}
          </div>
          {data?.id === "milestone_ten" && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              ⏱️ <strong>Time Bonus/Penalty:</strong> -5 points if submitted &gt;1 hour early, +5 points if submitted &gt;30 min late
            </p>
          )}
          {data?.id !== "milestone_ten" && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-4">
              ℹ️ <strong>Manual Grading:</strong> This milestone is graded manually without submission requirements
            </p>
          )}
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {userResponses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No submissions yet for this milestone</p>
            </div>
          ) : (
            userResponses.map((uR, idx) => {
              const hasJudged = uR[data?.id ?? ""]?.[user!.uid] != undefined;
              const judgeScores = uR[data?.id ?? ""]?.[user!.uid] || [];
              
              return (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {uR.teamName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {uR.teamCode} • {uR.allotedClassrooms || "No classroom"}
                      </p>
                    </div>
                    {uR[`${data?.id}_link`] ? (
                      <a
                        href={uR[`${data?.id}_link`]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <VisibilityOutlined fontSize="small" />
                        View Submission
                      </a>
                    ) : (
                      <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                        Manual Grading
                      </div>
                    )}
                  </div>

                  {hasJudged ? (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="text-green-600 dark:text-green-400" />
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          You have already judged this team
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        {rubrics.map((rubric, index) => (
                          <div key={rubric.id} className="text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {rubric.name.split(" ")[0]}
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {judgeScores[index]}/5
                            </p>
                          </div>
                        ))}
                        <div className="text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time</p>
                          <p className={`text-lg font-bold ${judgeScores[5] === 0 ? 'text-gray-900 dark:text-white' : judgeScores[5] > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {judgeScores[5] > 0 ? '+' : ''}{judgeScores[5]}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          Total Score: <span className="font-bold text-lg text-green-700 dark:text-green-300">
                            {judgeScores.reduce((sum, score) => sum + score, 0)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleJudge(e, uR)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rubrics.map((rubric, index) => (
                          <div key={rubric.id}>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                              {index + 1}. {rubric.name}
                            </label>
                            <input
                              type="number"
                              name={`score-${index + 1}`}
                              min="0"
                              max="5"
                              required
                              placeholder="0-5"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                      >
                        Submit Scores
                      </button>
                    </form>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
