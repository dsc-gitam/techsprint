"use client";
import { useParams, useSearchParams } from "next/navigation";
import milestones from "@/data/milestones.json";
import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { VisibilityOutlined } from "@mui/icons-material";
import { useAuthContext } from "@/context/AuthContext";

export default function Page() {
  const [userResponses, setUserResponses] = useState<any[]>([]);
  const data =
    milestones.filter((m) => m.id == useParams()["id"]).length > 0
      ? milestones.filter((m) => m.id == useParams()["id"])[0]
      : undefined;
  useEffect(() => {
    if (data?.id != null) {
      fetchMilestonesData(data.id).then((pages) => {
        console.log(pages);
        setUserResponses(pages);
      });
    }
  }, [data?.id]);
  async function fetchMilestonesData(id: string) {
    var responses: any[] = [];
    const documents = await getDocs(query(collection(db, "teams")));
    documents.forEach((document) => {
      const response = document.data();
      if (response[`${id}_score`] != undefined) {
        responses = [...responses, document.data()];
      }
    });
    return responses;
  }
  const user = useAuthContext();

  return (
    <div className="p-8">
      <p className="text-xl font-medium opacity-50">
        {data?.title.split(": ")[0]}
      </p>
      <h3 className="text-4xl font-bold mb-8">{data?.title.split(": ")[1]}</h3>
      <div>
        {userResponses.map((uR) => {
          return (
            <div className="py-5 flex gap-4">
              <h5 className="font-medium w-[20%]">{uR.teamName}</h5>
              <a href={uR[`${data?.id}_link`]} target="_blank">
                <VisibilityOutlined />
              </a>
              {((uR[data?.id ?? ""] as any | undefined) == undefined || uR[data?.id ?? ""][user!.uid] == undefined) ? <form className="flex gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fD = new FormData(e.currentTarget);
                  const score_1 = parseInt(fD.get("score-1") as any) ?? 0;
                  const score_2 = parseInt(fD.get("score-2") as any) ?? 0;
                  const score_3 = parseInt(fD.get("score-3") as any) ?? 0;
                  const score_4 = parseInt(fD.get("score-4") as any) ?? 0;
                  const score_5 = parseInt(fD.get("score-5") as any) ?? 0;
                  if (score_1 > 5 || score_2 > 5 || score_3 > 5 || score_4 > 5 || score_5 > 5) {
                    alert("Scores should be within 5");
                  }

                  console.log(
                    "Scores",
                    score_1,
                    score_2,
                    score_3,
                    score_4,
                    score_5
                  );
                  const tScore = score_1 + score_2 + score_3 + score_4 + score_5;
                  const d6 = ((new Date(uR[`${data?.id}_time`].toDate()) as any) - ((new Date(Date.parse("24 Mar 2026 15:30:00 GMT+0530"))) as any)) < -3600000 ? 5 : ((new Date(uR[`${data?.id}_time`].toDate()) as any) - ((new Date(Date.parse("24 Mar 2026 15:30:00 GMT+0530"))) as any)) > 1800000 ? -5 : 0;
                  console.log(d6);
                  const judgeScore = {
                    [user!.uid]: [score_1, score_2, score_3, score_4, score_5, d6],
                  };
                  console.log(judgeScore);
                  await setDoc(doc(db, "teams", uR.teamName), {
                    [data?.id ?? "milestone_score"]: judgeScore
                  }, { merge: true });
                  alert("Updated.");
                  fetchMilestonesData(data!.id).then((pages) => {
                    console.log(pages);
                    setUserResponses(pages);
                  });
                }}
              >
                <input
                  className="w-36 py-2 px-4 border-2 border-black/50 rounded-xl"
                  name="score-1"
                  placeholder="Score"
                />
                <input
                  className="w-36 py-2 px-4 border-2 border-black/50 rounded-xl"
                  name="score-2"
                  placeholder="Score"
                />
                <input
                  className="w-36 py-2 px-4 border-2 border-black/50 rounded-xl"
                  name="score-3"
                  placeholder="Score"
                />
                <input
                  className="w-36 py-2 px-4 border-2 border-black/50 rounded-xl"
                  name="score-4"
                  placeholder="Score"
                />
                <input
                  className="w-36 py-2 px-4 border-2 border-black/50 rounded-xl"
                  name="score-5"
                  placeholder="Score"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-full font-bold uppercase text-sm"
                >
                  Update
                </button>
              </form> : <div>Judged already.</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
