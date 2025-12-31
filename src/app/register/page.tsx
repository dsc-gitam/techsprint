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
import { useRouter, useSearchParams } from "next/navigation";
import {
  collection,
  doc,
  documentId,
  getCountFromServer,
  getDocs,
  query,
  setDoc,
  updateDoc,
  arrayUnion,
  where,
} from "firebase/firestore";
import { ArrowForwardIos, EmojiEventsOutlined, ContentCopy, CheckCircle } from "@mui/icons-material";
import GetUserProgress from "@/utils/getUserProgress";
import Progress from "@/utils/progress";

const MyForm: React.FC = () => {
  const MAX_CODE_GENERATION_ATTEMPTS = 10;
  const user = useAuthContext();
  const searchParams = useSearchParams();
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
        // Old user migration: Payment is now skipped. Auto-capture payment and redirect.
        // We also set isTeamMember to 0 (if it was -1) to ensure they are treated as fully registered.
        updateDoc(doc(db, "registrations", user.uid), {
          payment_status: "captured",
          isTeamMember: 0, // Ensure they are not stuck in "notYetTeamMember"
        }).then(() => {
          window.location.href = "/dashboard";
        });
        return;
      }
      if (response === Progress.incompleteRegistration) {
        // If registration is incomplete (missing fields), show the form to let them finish.
        setLoadingState(false);
        setRegistrationStatus(false);
        setPopUp(false);
        return;
      }
      if (response === Progress.notYetTeamMember) {
        // Old user migration: User registered but was in "confirmation pending" state (-1).
        // Update to 0 (Registered, no team) and redirect.
        updateDoc(doc(db, "registrations", user.uid), {
          isTeamMember: 0,
        }).then(() => {
          window.location.href = "/dashboard";
        });
        return;
      }
      if (
        response === Progress.completeRegistration ||
        response === Progress.completeRegistrationTeamLead
      ) {
        // User is fully registered. Redirect to dashboard.
        window.location.href = "/dashboard";
        return;
      }
    });
  }, [user]);

  const [formState, setFormState] = useState(initialFormData);
  const [isTeamLead, setIsTeamLead] = useState<boolean | undefined>(undefined);
  const [referralCode, setReferralCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedReferralCode, setGeneratedReferralCode] = useState("");
  const [teamCreated, setTeamCreated] = useState(false);
  const router = useRouter();
  
  // Check for referral code in URL
  useEffect(() => {
    const urlReferralCode = searchParams.get("referral");
    if (urlReferralCode) {
      setReferralCode(urlReferralCode.toUpperCase());
      setIsTeamLead(false); // Automatically set as team member
    }
  }, [searchParams]);

  // Auto-fill referral code from URL parameter
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setReferralCode(codeFromUrl.toUpperCase());
      setIsTeamLead(false); // Automatically select "No, I'll join a team"
    }
  }, [searchParams]);

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

  const generateReferralCode = () => {
    let code = "";
    // Ensure we always generate at least 6 characters before slicing
    while (code.length < 6) {
      code += Math.random().toString(36).substring(2);
    }
    return code.substring(0, 6).toUpperCase();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = () => {
    const shareUrl = `${window.location.origin}/register?referral=${generatedReferralCode}`;
    const shareText = `Join my team "${teamName}" for TechSprint 2026!\n\nClick this link to register and auto-join: ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Join my TechSprint team!",
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };
  
  const getReferralUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/register?referral=${generatedReferralCode}`;
    }
    return '';
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

    let teamInfo = null;
    let generatedCode = "";

    // If team lead, create the team
    if (isTeamLead && teamName) {
      try {
        const teamsRef = collection(db, "teams");
        const teamQuery = query(teamsRef, where("teamName", "==", teamName));
        const count = (await getCountFromServer(teamQuery)).data().count;

        if (count > 0) {
          alert("Team name already exists. Please choose a different name.");
          setLoadingState(false);
          return;
        }

        // Generate referral code
        generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Get team number
        const teamNumber = (await getCountFromServer(query(teamsRef))).data().count + 1;

        // Create team document
        await setDoc(doc(db, "teams", teamName), {
          teamName: teamName,
          teamNumber: teamNumber,
          referralCode: generatedCode,
          leaderId: user.uid,
          participants: [user.uid],
          createdAt: new Date().toISOString(),
        });

        teamInfo = {
          teamName: teamName,
          isTeamMember: 1,
          referralCode: generatedCode,
        };
      } catch (error) {
        console.error("Error creating team:", error);
        alert("Failed to create team. Please try again.");
        setLoadingState(false);
        return;
      }
    }

    // If team lead, create team first
    if (isTeamLead) {
      if (!teamName.trim()) {
        alert("Please enter a team name");
        setLoadingState(false);
        return;
      }

      try {
        // Check if team name is unique
        const teamsRef = collection(db, "teams");
        const teamQuery = query(teamsRef, where("teamName", "==", teamName));
        const count = (await getCountFromServer(teamQuery)).data().count;

        if (count > 0) {
          alert("Team name already exists. Please choose a different name.");
          setLoadingState(false);
          return;
        }

        // Generate referral code with uniqueness check
        let code = generateReferralCode();
        let codeExists = true;
        let attempts = 0;
        
        while (codeExists && attempts < MAX_CODE_GENERATION_ATTEMPTS) {
          const codeQuery = query(teamsRef, where("referralCode", "==", code));
          const codeCount = (await getCountFromServer(codeQuery)).data().count;
          if (codeCount === 0) {
            codeExists = false;
          } else {
            code = generateReferralCode();
            attempts++;
          }
        }

        if (codeExists) {
          alert("Failed to generate unique referral code. Please try again.");
          setLoadingState(false);
          return;
        }

        setGeneratedReferralCode(code);

        // Get team number
        const teamNumber = (await getCountFromServer(query(teamsRef))).data().count + 1;

        // Create team document
        await setDoc(doc(db, "teams", teamName), {
          teamName: teamName,
          teamNumber: teamNumber,
          referralCode: code,
          leaderId: user.uid,
          participants: [user.uid],
          createdAt: new Date().toISOString(),
        });

        teamInfo = {
          teamName: teamName,
          isTeamMember: 1,
        };

        setTeamCreated(true);
      } catch (error) {
        console.error("Error creating team:", error);
        alert("Failed to create team. Please try again.");
        setLoadingState(false);
        return;
      }
    }
    // If member provided a referral code, validate and join team
    else if (!isTeamLead && referralCode) {
      try {
        const teamsRef = collection(db, "teams");
        const teamQuery = query(teamsRef, where("referralCode", "==", referralCode.toUpperCase()));
        const teamSnapshot = await getDocs(teamQuery);

        if (teamSnapshot.empty) {
          alert("Invalid referral code. Please check and try again.");
          setLoadingState(false);
          return;
        }

        const teamDoc = teamSnapshot.docs[0];
        const teamData = teamDoc.data();
        
        // Check if team is full (max 5 members)
        if (teamData.participants && teamData.participants.length >= 5) {
          alert("This team is full (maximum 5 members). Please use a different referral code.");
          setLoadingState(false);
          return;
        }

        // Check if user is already in this team
        if (teamData.participants && teamData.participants.includes(user.uid)) {
          alert("You are already in this team!");
          setLoadingState(false);
          return;
        }

        // Add user to team
        await updateDoc(doc(db, "teams", teamDoc.id), {
          participants: arrayUnion(user.uid),
        });

        teamInfo = {
          teamName: teamData.teamName,
          isTeamMember: 1,
        };
      } catch (error) {
        console.error("Error validating referral code:", error);
        alert("Failed to join team. Please try again.");
        setLoadingState(false);
        return;
      }
    }

    // Save registration data
    await addData("registrations", user.uid, {
      ...formState,
      ["displayPicture"]: user?.photoURL ?? "",
      ["isTeamMember"]: teamInfo ? 1 : 0,
      ["isTeamLead"]: isTeamLead ? 1 : 0,
      ["coc"]: 1,
      ["terms"]: 1,
      ["payment_status"]: "captured",
      ["teamName"]: teamInfo?.teamName ?? "",
    });
    
    // If team lead, show referral code before redirecting
    if (isTeamLead && generatedCode) {
      alert(`Team created successfully! Your referral code is: ${generatedCode}\n\nShare this code with your team members.`);
    }
    
    // Redirect to dashboard
    window.location.href = "/dashboard";
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

            <p className="opacity-60 mt-3 text-lg text-gray-700 dark:text-gray-300">3-4th January 2026</p>

            <p className="text-gray-700 dark:text-gray-300">Gandhi Institute of Technology and Management, Visakhapatnam</p>
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
            Visakhapatnam so that you don&apos;t miss out on the fun and learning.
            You can also use your profile to earn badges during the conference.
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
                className="register-input grow text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />

              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                placeholder="Last Name"
                value={formState.lastName}
                onChange={handleChange}
                className="register-input grow text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <div className="flex  flex-col md:flex-row md:space-x-8  gap-y-4 md:gap-y-[unset]">
              <input
                type="email"
                id="email"
                name="email"
                required
                readOnly
                placeholder="Email Address"
                value={formState.email}
                onChange={handleChange}
                className="register-input grow md:w-1/2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
              />
              <select
                name="gender"
                className="register-input grow md:w-1/2 text-gray-900 dark:text-white"
                onChange={handleSelectChange}
                required
              >
                <option className="dark:bg-black" value="">Pronouns (select)</option>
                <option className="dark:bg-black">She/Her</option>
                <option className="dark:bg-black">He/Him</option>
                <option className="dark:bg-black">They/Them</option>
              </select>
            </div>
            <div className="flex  flex-col md:flex-row md:space-x-8 gap-y-4 md:gap-y-[unset">
              
              <div className="md:w-1/2 ">
                <select
                  className="w-full register-input h-max text-gray-900 dark:text-white"
                  required
                  onChange={handleSelectChange}
                  name="university"
                >
                  <option className="dark:bg-black" value="">University (select)</option>
                  <option className="dark:bg-black">Gandhi Institute of Technology and Management</option>

                  <option className="dark:bg-black">Gayatri Vidya Parishad College of Engineering</option>
                  <option className="dark:bg-black">
                    Gayatri Vidya Parishad College of Engineering for Women
                  </option>
                  <option className="dark:bg-black">Andhra University College of Engineering</option>
                  <option className="dark:bg-black">Vignan&apos;s Institute of Information Technology</option>
                  <option className="dark:bg-black">Vignan Institute of Engineering Women</option>
                  <option className="dark:bg-black">Raghu Engineering College</option>
                  <option className="dark:bg-black">GMR Institute of Technology</option>
                  <option className="dark:bg-black">SVR Engineering College</option>
                  <option className="dark:bg-black">
                    G. Pullaiah College of Engineering and Technology
                  </option>
                  <option className="dark:bg-black">
                    Maharaj Vijayaram Gajapathi Raj College of Engineering
                  </option>
                  <option className="dark:bg-black">Sagi Ramakrishnam Raju Engineering College</option>
                  <option className="dark:bg-black">Pragati Engineering College</option>
                  <option className="dark:bg-black">
                    Geethanjali Institute of Science and Technology
                  </option>
                  <option className="dark:bg-black">Aditya Institute of Technology and Management</option>
                  <option className="dark:bg-black">Other</option>
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
                    className="register-input grow mt-4 w-full text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
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

            {/* Team Registration Section */}
            <div className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="font-bold text-lg text-gray-900 dark:text-white mb-3">Team Registration</p>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Are you a team lead?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Team leads create teams and get a referral link. Team members use the link to join.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isLead"
                    checked={isTeamLead === true}
                    onChange={() => {
                      setIsTeamLead(true);
                      setReferralCode("");
                    }}
                    required
                    disabled={!!searchParams.get("referral")}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900 dark:text-gray-300">Yes, I&apos;ll create a team</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isLead"
                    checked={isTeamLead === false}
                    onChange={() => {
                      setIsTeamLead(false);
                      setTeamName("");
                    }}
                    required
                    disabled={!!searchParams.get("referral")}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900 dark:text-gray-300">No, I&apos;ll join a team</span>
                </label>
              </div>
              
              {isTeamLead === true && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    required={isTeamLead === true}
                    minLength={3}
                    maxLength={50}
                    className="register-input w-full"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose a unique name for your team (3-50 characters)
                  </p>
                </div>
              )}
              
              {isTeamLead === false && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Team Referral Code {searchParams.get("referral") ? "" : "(Optional)"}
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => {
                      const raw = e.target.value.toUpperCase();
                      const cleaned = raw.replace(/[^A-Z0-9]/g, "");
                      setReferralCode(cleaned);
                    }}
                    placeholder="Enter code (e.g., ABC123)"
                    maxLength={6}
                    disabled={!!searchParams.get("referral")}
                    className="register-input w-full uppercase disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                  />
                  {searchParams.get("referral") ? (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                      <CheckCircle fontSize="small" className="mr-1" />
                      Referral code auto-filled from link. You&apos;ll automatically join this team!
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get this code from your team lead. You can also join a team later.
                    </p>
                  )}
                </div>
              )}
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
        
        {/* Team Creation Success Modal */}
        {teamCreated && !loading && (
          <div className="absolute top-0 w-full h-full flex items-center justify-center z-20 bg-opacity-50 bg-black dark:bg-opacity-70 md:ml-[80px] p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" style={{ fontSize: 64 }} />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Created Successfully!</h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">Team: {teamName}</p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Referral Link</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-widest">{generatedReferralCode}</p>
                  <button
                    onClick={() => copyToClipboard(generatedReferralCode)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <ContentCopy className="text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded p-3 mb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-all">
                    {getReferralUrl()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Share this link with your team members</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When they click the link, the referral code will be auto-filled and they&apos;ll automatically join your team!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={shareReferralLink}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                >
                  Share Link
                </button>
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
        
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
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Application Received</h2>
                  <p className="text-sm mt-4 mb-8 max-w-[420px] text-gray-700 dark:text-gray-300">
                    You&apos;ll be notified of the status of your hackathon team
                    soon. If you&apos;re not into a team before the hackathon, we&apos;ll
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
                  <h2 className="text-2xl font-medium mt-4 text-gray-900 dark:text-white">You&apos;re in.</h2>
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
                    We&apos;re sold out on tickets. But, its not the end of the
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
