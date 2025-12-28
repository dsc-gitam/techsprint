"use client";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import QRCode from "react-qr-code";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Profile() {
  const user = useAuthContext();
  const [userData, setUserData] = useState<any>(undefined);
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    if (user == null || user === undefined) {
      return;
    }
    getDoc(doc(db, "registrations", user.uid)).then((document) => {
      const response = document.data();
      setUserData(response);
    });
  }, [user]);
  return (
    <div className="w-full flex flex-col items-center h-full">
      {user !== null && user.photoURL !== null && userData != undefined && (
        <>
          <img
            src={user.photoURL}
            className="my-3 mx-2 w-[100px] h-[100px] rounded-full aspect-square"
          />
          <p className="text-xl my-1 font-medium max-w-[400px]">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-l my-1">{userData.university}</p>
          <p
            className={`text-l my-1 ${
              userData.gender === "He/Him" ? "text-blue-500" : "text-pink-500"
            }`}
          >
            {userData.gender}
          </p>
        </>
      )}
      <div className="flex mt-10 gap-8">
        <p
          onClick={() => {
            setTabIndex(0);
          }}
          className={`cursor-pointer pt-2 pb-8 sm:py-8 text-xl font-light inline-flex ${
            tabIndex == 0
              ? "text-blue-500 font-medium underline underline-offset-[12px]"
              : ""
          }`}
        >
          Your QR Code
        </p>

        {/* <p
          onClick={() => {
            setTabIndex(1);
          }}
          className={`cursor-pointer pt-2 pb-8 sm:py-8 text-xl font-light inline-flex ${
            tabIndex == 1
              ? "text-blue-500 font-medium underline underline-offset-[12px]"
              : ""
          }`}
        >
          Scan QR Code
        </p> */}
      </div>
      {tabIndex == 0 && (
        <div className="flex felx-col justify-center">
          <QRCode
            size={300}
            style={{ height: "auto", maxWidth: "70%", width: "70%" }}
            value={user?.uid ?? ""}
            className="m-10 sm:mb-24 "
            viewBox={`0 0 128 128`}
          />
        </div>
      )}
      {tabIndex == 1 && <div></div>}
      <Link href="?signout">
        <div className="border-[2px] border-red-300 rounded-[20px] text-red-500 px-4 py-2 text-[19px] font-medium">
          Signout
        </div>
      </Link>
    </div>
  );
}
