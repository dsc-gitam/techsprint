"use client";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  useEffect(() => {
    getDocs(query(collection(db, "teams"))).then(
      (querySnapshot) => {
        const documents = querySnapshot.docs;
        var docs: any[] = [];
        documents.forEach((doc1) => {
          const d1 = doc1.data();
          const d = {
            teamName: d1.name,
            score: d1.milestone_one == undefined ? 0 : Object.values(d1.milestone_one).reduce((g, f: any) => f.reduce((a: any, b: any) => a + b, 0) + g, 0)
          };
          docs = [...docs, d];
        });
        setLeaderboard(docs);
      }
    );
  });
  return (
    <div className="px-6 py-12 bg-(--background)">
      <h2 className="text-3xl ">Leaderboard</h2>
      {leaderboard
        .sort((a, b) => b.score - a.score)
        .map((f, i) => {
          return (
            <p className="py-2">
              <span className="mr-6">{i + 1}</span>
              {f.teamName}
            </p>
          );
        })}
    </div>
  );
}
