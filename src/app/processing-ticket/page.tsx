"use client";
import { auth, db } from "@/lib/firebase";
import Loader from "@/components/LoadingAnimation/page";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    console.log("Processing Ticket Page");
    if (!auth.currentUser) return;
    const unsub = onSnapshot(
      doc(db, "registrations", auth.currentUser.uid),
      (doc) => {
        const result = doc.data();
        if (result?.payment_status === "captured") {
          console.log("Payment Captured");
          setStatus("success");
          setTimeout(() => {
            window.location.href = "/confirmation";
          }, 5000);
        } else if (result?.payment_status === "failed") {
          console.log("Payment Failed");
          setStatus("failed");
        }
      }
    );
  }, []);
  const [timer, setTimer] = useState(5);
  useEffect(() => {
    if (status === 'success') {
      const ti = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(ti);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(ti);
    }
  }, [status])
  return (
    <div className="w-full h-[calc(100vh-350px)] md:h-[calc(100vh-192px)] flex flex-col justify-center items-center">
      {/* <p>Status: {status}</p> */}
      {status === "pending" && <><Loader /><h1 className="text-3xl">Processing Payment...</h1></>}
      {status === "success" && (
        <>
          <img src="payment-success.png" className="p-6" />
          <h1 className="text-3xl font-bold">
            Payment Successful
          </h1>
          <p>
            Redirecting you in {timer}s
          </p>
        </>
      )}
      {status === "failed" && (
        <>
          <img src="payment-error.png" className="p-6"/>
          <h1 className="text-3xl font-bold">
            Payment Failed
          </h1>
          <p>Try again later.</p>
          <a href="/register" className="rounded-full px-8 py-3 mt-6 bg-black text-white">Try Again</a>
        </>
      )}
    </div>
  );
}
