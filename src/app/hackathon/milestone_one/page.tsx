"use client";

import { db, storage } from "@/lib/firebase";
import Loader from "@/components/LoadingAnimation/page";
import { useAuthContext } from "@/context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";

export default function Page() {
  const user = useAuthContext();
  const [teamDocId, setTeamDocId] = useState<string | undefined>(undefined);
  const [isLoading, setLoader] = useState(true);
  useEffect(() => {
    if (user != null) {
      const refTeam = collection(db, "teams");
      getDocs(query(refTeam, where("participants", "array-contains", user.uid)))
        .then(async (snapshot) => {
          // console.log(snapshot.docs);
          const teamDetailsId = snapshot.docs[0].id;
          setTeamDocId(teamDetailsId);
          const dt = snapshot.docs[0].data()["milestone_one_time"];
          if (dt == undefined || dt == null) {
          } else {
            alert(
              "You have already submitted. Your last submission was at " +
                dt.toDate().toLocaleString() +
                "."
            );
          }
        })
        .then((_) => {
          setLoader(false);
        });
    } else {
      setLoader(false);
    }
  }, [user]);
  return (
    <>
      <div className="p-4 h-[88%] pt-16">
        <h3 className="text-xl font-bold uppercase opacity-50">Miletone 1</h3>
        <h2 className="text-4xl font-medium mb-8">
          Idea Research Document (IRD)
        </h2>
        <form
          onSubmit={async (f) => {
            f.preventDefault();
            setLoader(true);
            const file = new FormData(f.currentTarget).get("srs");
            const r = ref(
              storage,
              `${user?.uid}${serverTimestamp()}.${
                (file as any)?.name.split(".")[1]
              }`
            );
            await uploadBytes(r, file as File).then((snapshot: any) => {
              console.log("Uploaded a blob or file!");
            });
            const dUrl = await getDownloadURL(r);
            if (teamDocId != undefined) {
              await updateDoc(doc(db, "teams", teamDocId), {
                milestone_one_link: dUrl,
                milestone_one_score_aggregate: -1,
                score: -1,
                milestone_one_time: serverTimestamp(),
                milestone_one_score: [],
              });
              setLoader(false);
              alert("Submitted successfully.");
              window.location.href = "/";
            } else {
              setLoader(false);
            }
          }}
        >
          <label>
            Upload a file (in DOCX/PDF within 2MB):{" "}
            <input
              name="srs"
              placeholder="Submit the SRS (in PDF/DOCX)"
              className="mt-2 w-full py-4 rounded-xl"
              type="file"
            />
          </label>
          <button
            className="text-white bg-black px-8 py-3 rounded-full mt-2"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      {isLoading && (
        <div className="fixed top-0 bg-white w-full h-full">
          <Loader />
        </div>
      )}
    </>
  );
}
