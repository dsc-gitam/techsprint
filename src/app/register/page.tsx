"use client";
import "../register/style.css";
import React, { useEffect, useState } from "react";
import initialFormState from "@/interfaces/initialFormState";
import initialFormData from "@/utils/formstate";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import addData from "@/utils/addData";
import Loader from "@/components/LoadingAnimation/page";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  documentId,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { ArrowForwardIos, EmojiEventsOutlined } from "@mui/icons-material";
import GetUserProgress from "@/utils/getUserProgress";
import Progress from "@/utils/progress";

const MyForm: React.FC = () => {
  const user = useAuthContext();
  const [loading, setLoadingState] = useState(true);
  const [registered, setRegistrationStatus] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [isCompleteRegistration, setIsCompleteRegistration] = useState(false);
  useEffect(() => {
    if (user === null) {
      alert("Please login to register for Techsprint");
      window.location.href = "/";
      return;
    }
    GetUserProgress(user.uid).then((response) => {
      console.log(response);
      if (response === Progress.noApplication) {
        setLoadingState(false);
        setRegistrationStatus(false);
        setPopUp(false);
      }
      if (response === Progress.paymentPending) {
        // Payment flow disabled - redirect to confirmation
        window.location.href = "/confirmation";
        return;
      }
      if (response === Progress.incompleteRegistration) {
        window.location.href = "/confirmation";
        return;
      }
      if (response === Progress.notYetTeamMember) {
        setLoadingState(true);
        setRegistrationStatus(true);
        setPopUp(false);
      }
      if (
        response === Progress.completeRegistration ||
        response === Progress.completeRegistrationTeamLead
      ) {
        setLoadingState(true);
        setRegistrationStatus(true);
        setIsCompleteRegistration(true);
        setPopUp(false);
      }
    });
  }, [user]);

  const [formState, setFormState] = useState(initialFormData);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(true);
    console.log(formState);
    setFormState((prevState) => ({
      ...prevState,
      ["coc"]: 1,
      ["terms"]: 1,
    }));

    if (!user?.uid) {
      alert("User not authenticated");
      setLoadingState(false);
      return;
    }

    await addData("registrations", user.uid, {
      ...formState,
      ["displayPicture"]: user?.photoURL ?? "",
      ["isTeamMember"]: -1,
      ["isTeamLead"]: 0,
      ["coc"]: 1,
      ["terms"]: 1,
      ["payment_status"]: "captured", // Skip payment for now
    });
    // Redirect directly to confirmation page
    window.location.href = "/confirmation";
    // setPopUp(true); // Commented out - payment flow disabled
    // setRegistrationStatus(true);
  };

  useEffect(() => {
    const firstName = user?.displayName?.split(" ").at(0) ?? "";
    const lastName = user?.displayName?.replaceAll(firstName + " ", "") ?? "";

    setFormState((prevState) => ({
      ...prevState,
      ["firstName"]: firstName,
      ["lastName"]: lastName,
      ["email"]: user?.email ?? "",
    }));
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center md:py-[60px] md:px-[unset] bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div className="flex flex-col justify-center items-center md:rounded-xl md:border-[1.5px] border-gray-500 dark:border-gray-700 md:w-4/5 bg-white dark:bg-[#141414]">
        <div className="w-full md:rounded-t-xl bg-gray-200 dark:bg-gray-800 flex flex-col md:flex-row p-[20px] pt-[32px] pb-0 border-gray-500 dark:border-gray-700 border-b-[1.5px]">
          <div className="md:grow md:pt-[30px] md:pl-[40px] pt-[20px] pb-[40px] md:pb-[unset]">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white">Register for TechSprint 2026</h1>

            <p className="opacity-60 mt-3 text-lg text-gray-700 dark:text-gray-300">24-25th March 2026</p>

            <p className="opacity-60 text-gray-700 dark:text-gray-300">GITAM University, Visakhapatnam</p>
          </div>
          <img
            src="gdsc_sc.webp"
            className="md:h-56 -scale-x-100 translate-y-1 md:translate-y-2"
          /> 
        </div>
        <div className="md:w-4/5 md:mr-auto md:mt-10 p-[20px] pb-0 md:p-[unset] md:ml-auto bg-white dark:bg-[#141414]">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create a developer profile</h3>
          <p className="mt-2 max-w-[480px] md:text-base text-sm text-gray-700 dark:text-gray-300">
            Create your developer profile to apply for a ticket to Google TechSprint 2026
            Visakhapatnam so that you don't miss out on the fun and learning.
            You can also use your profile to earn badges during the conference.
          </p>
          <p className="font-medium text-gray-900 dark:text-white">
            Note: This is a paid event, an offline <b>ticket costs ₹200</b>.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-[20px] md:px-[unset] md:w-4/5 bg-white dark:bg-[#141414]"
        >
          <div className="mb-4 py-8 rounded-3xl w-full  flex flex-col space-y-4 md:space-y-8">
            <div className="flex flex-col md:flex-row md:space-x-8 gap-y-4 md:gap-y-[unset]">
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                placeholder="First Name"
                value={formState.firstName}
                onChange={handleChange}
                className="register-input grow"
              />

              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                placeholder="Last Name"
                value={formState.lastName}
                onChange={handleChange}
                className="register-input grow"
              />
            </div>
            <div className="flex  flex-col md:flex-row md:space-x-8  gap-y-4 md:gap-y-[unset]">
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Email Address"
                value={formState.email}
                onChange={handleChange}
                className="register-input grow md:w-1/2"
              />
              <select
                name="gender"
                className="register-input grow md:w-1/2"
                onChange={handleSelectChange}
                required
              >
                <option value="">Pronouns (select)</option>
                <option>She/Her</option>
                <option>He/Him</option>
                <option>They/Them</option>
              </select>
            </div>
            <div className="flex  flex-col md:flex-row md:space-x-8 gap-y-4 md:gap-y-[unset">
              <div className="grow md:w-1/2">
                <input
                  type="url"
                  id="socialProfile"
                  name="socialProfile"
                  placeholder="Website (optional)"
                  value={formState.socialProfile}
                  onChange={handleChange}
                  className="register-input w-full"
                />
                <p className="mt-2 md:mt-4 max-w-[440px] text-[12px] text-gray-700 dark:text-gray-400">
                  Share us a link where we can get to know more about you. It
                  can be your website, social media, or literally anything you
                  want us to know
                </p>
              </div>
              <div className="md:w-1/2">
                <select
                  className="w-full register-input h-max"
                  required
                  onChange={handleSelectChange}
                  name="university"
                >
                  <option value="">University (select)</option>
                  <option>Gandhi Institute of Technology and Management</option>

                  <option>Gayatri Vidya Parishad College of Engineering</option>
                  <option>
                    Gayatri Vidya Parishad College of Engineering for Women
                  </option>
                  <option>Andhra University College of Engineering</option>
                  <option>Vignan's Institute of Information Technology</option>
                  <option>Vignan Institute of Engineering Women</option>
                  <option>Raghu Engineering College</option>
                  <option>GMR Institute of Technology</option>
                  <option>SVR Engineering College</option>
                  <option>
                    G. Pullaiah College of Engineering and Technology
                  </option>
                  <option>
                    Maharaj Vijayaram Gajapathi Raj College of Engineering
                  </option>
                  <option>Sagi Ramakrishnam Raju Engineering College</option>
                  <option>Pragati Engineering College</option>
                  <option>
                    Geethanjali Institute of Science and Technology
                  </option>
                  <option>Aditya Institute of Technology and Management</option>
                  <option>Other</option>
                </select>
                {formState.university === "Other" && (
                  <input
                    type="text"
                    id="otherUniversity"
                    name="otherUniversity"
                    required
                    placeholder="Institution Name"
                    value={formState.otherUniversity}
                    onChange={handleChange}
                    className="register-input grow mt-4 w-full"
                  />
                )}
              </div>
            </div>
            {formState.gender === "She/Her" && (
              <div>
                <label className="mr-3 text-[20px] text-gray-900 dark:text-white">Accommodation</label>
                <br />
                <input
                  name="acco"
                  type="radio"
                  id="accoYes"
                  className="mr-2"
                  checked={formState.accommodation == 1}
                  onChange={() => {
                    setFormState((prevState) => ({
                      ...prevState,
                      ["accommodation"]: 1,
                    }));
                  }}
                />
                <label htmlFor="accoYes" className="mr-8 ml-1 text-gray-900 dark:text-gray-300">
                  Yes
                </label>
                <input
                  name="acco"
                  type="radio"
                  id="accoNo"
                  className="mr-2"
                  checked={formState.accommodation == 0}
                  onChange={() => {
                    setFormState((prevState) => ({
                      ...prevState,
                      ["accommodation"]: 0,
                    }));
                  }}
                />
                <label htmlFor="accoNo" className="mr-2 ml-1 text-gray-900 dark:text-gray-300">
                  No
                </label>
                <p className="mt-2 md:mt-4 text-[16px] text-gray-700 dark:text-gray-300">
                  Note: <br />
                  <b>Eligibility</b>: Accommodation is exclusively available for
                  female attendees traveling from outside the local area. <br />
                  <b>Availability</b>: Please note that accommodation is limited
                  and cannot be guaranteed for all eligible participants. <br />
                  <b>Confirmation</b>: Successful applicants will receive a
                  confirmation email with further details regarding their
                  accommodation. <br />
                  <b>Payment</b>: Accommodation costs are not included in the
                  event registration fee. Payment will be required separately at
                  the venue upon check-in.
                </p>
              </div>
            )}
          </div>
          <div>
            <div className="flex space-x-3">
              <input type="checkbox" name="terms" required />
              <p className="text-gray-900 dark:text-gray-300">
                I agree to the{" "}
                <button
                  onClick={() => {
                    const tcWindow = window
                      .open(
                        "/faq#terms-conditions",
                        "Terms and Conditions | Techsprint 2026 Visakhapatnam",
                        "popup, location,status,scrollbars,resizable,width=600, height=600"
                      )
                      ?.focus();
                  }}
                  className="text-gray-900 dark:text-white"
                >
                  <b>terms and conditions</b>
                </button>
                .
              </p>
            </div>
            <div className="flex space-x-3">
              <input type="checkbox" name="coc" required />
              <p className="text-gray-900 dark:text-gray-300">
                I agree to abide by the code of conduct{" "}
                <a
                  href="/coc"
                  target="_blank"
                  className="text-[#1a73e8] font-medium"
                >
                  here
                </a>
                .
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <button
              type="submit"
              className="py-2 px-6 text-blue-500 dark:text-blue-400 rounded border-neutral-300 dark:border-gray-600 border text-sm mb-16 mt-8 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              Next{" "}
              <span>
                <ArrowForwardIos
                  sx={{
                    fontSize: "10px",
                    fill: "#3b82f6 !important",
                  }}
                />
              </span>
            </button>
          </div>
        </form>
        {loading && (
          <div className="absolute top-0 w-full h-full flex items-center justify-center z-10 bg-opacity-50 bg-black dark:bg-opacity-70 md:ml-[80px] text-center">
            <div className="px-[40px] md:px-[80px] pb-[40px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mx-8 md:mx-[unset]">
              {!popUp && <Loader></Loader>}
              {!registered && !popUp && (
                <p className="font-medium text-gray-900 dark:text-white">
                  Please wait while we process your registration
                </p>
              )}
              {registered && !isCompleteRegistration && (
                <>
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Application Recieved</h2>
                  <p className="text-sm mt-4 mb-8 max-w-[420px] text-gray-700 dark:text-gray-300">
                    You'll be notified of the status of your hackathon team
                    soon. If you're not into a team before the hackathon, we'll
                    try to get you a team at the venue. Otherwise, request your
                    team lead to add you to the team.
                    <br />
                    Make sure to keep an eye on your email.
                  </p>
                  <button
                    onClick={() => {
                      setLoadingState(false);
                      setRegistrationStatus(false);
                      window.location.href = "/";
                    }}
                    className="border-[1.5px] px-8 py-2 rounded-full border-gray-500 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Done
                  </button>
                </>
              )}
              {registered && isCompleteRegistration && (
                <>
                  <EmojiEventsOutlined fontSize="large" className="mt-8 text-gray-900 dark:text-white" />
                  <h2 className="text-2xl font-medium mt-4 text-gray-900 dark:text-white">You're in.</h2>
                  <p className="text-sm mt-4 mb-8 max-w-[420px] text-gray-700 dark:text-gray-300">
                    Excited to host you for TechSprint 2026.
                    <br />
                    Earn badges and have fun before the event.
                    <br />
                    <br />
                    Make sure to keep an eye on your email.
                  </p>
                  <button
                    onClick={() => {
                      setLoadingState(false);
                      setRegistrationStatus(false);
                      window.location.href = "/";
                    }}
                    className="border-[1.5px] px-8 py-2 rounded-full border-gray-500 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Done
                  </button>
                </>
              )}
              {/* PAYMENT POPUP - TEMPORARILY DISABLED 
              {popUp && (
                <>
                  <h2 className="text-2xl font-medium mt-12 dark:text-white">
                    Confirm your payment
                  </h2>
                  <p className="mt-4 max-w-[480px] mx-auto dark:text-gray-300">
                    We're sold out on tickets. But, its not the end of the
                    world. We're amazed by your enthuasism, and we added more
                    tickets. Here's what your Rs. 200 ticket will unlock for
                    you:
                  </p>
                  <ul className="text-start list-disc list-inside my-4 dark:text-gray-300">
                    <li>Access to the 24 hour hackathon</li>
                    <li>Chance to win upto 9K cash prize pool</li>
                    <li>2 rounds of yummy itenary</li>
                    <li>Swags and goodies</li>
                    <li>Networking with industry experts</li>
                    <li>Certificate of participation</li>
                  </ul>
                  <button
                    onClick={async () => {
                      const createOrderId = async () => {
                        try {
                          console.log(user?.uid);
                          const response = await fetch(
                            "https://us-central1-techsprint-gitam.cloudfunctions.net/createOrder",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                userId: user?.uid,
                                amount: 20000,
                              }),
                            }
                          );

                          if (!response.ok) {
                            throw new Error("Network response was not ok");
                          }
                          const data = await response.json();
                          console.log(data);
                          return data["id"];
                        } catch (error) {
                          console.error(
                            "There was a problem with your fetch operation:",
                            error
                          );
                        }
                      };
                      try {
                        const createOrderIdValue = await createOrderId();
                        console.log(createOrderIdValue);
                        const options = {
                          key: "rzp_live_4GKxrZC526axav",
                          amount: 20000,
                          currency: "INR",
                          name: "TechSprint 2026 Visakhapatnam",
                          description: "Your ticket receipt for TechSprint 2026 Visakhapatnam",
                          order_id: createOrderIdValue,
                          handler: function (response: any) {
                            router.push("/processing-ticket");
                          },
                          prefill: {
                            name: auth.currentUser?.displayName,
                            email: auth.currentUser?.email,
                          },
                          theme: {
                            color: "#3399cc",
                          },
                          retry: {
                            enabled: false,
                          },
                          timeout: 300,
                        };
                        if (typeof window !== undefined) {
                          const paymentObject = new (window as any).Razorpay(
                            options
                          );
                          paymentObject.on(
                            "payment.failed",
                            function (response: any) {
                              router.push("/processing-ticket");
                              paymentObject.close();
                            }
                          );
                          paymentObject.open();
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    className="border-[1.5px] px-8 py-2 rounded-full border-gray-500 dark:border-gray-700 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:border-0"
                  >
                    Pay ₹200
                  </button>
                </>
              )}
              */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyForm;
