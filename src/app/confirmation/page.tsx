"use client";
import Loader from "@/components/LoadingAnimation/page";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";

import "./style.css";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { set, update } from "firebase/database";
import { useRouter } from "next/navigation";
import {
  and,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  or,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BadgeOutlined, EmojiEventsOutlined } from "@mui/icons-material";

export default function Confirmation() {
  interface Attendee {
    label: string;
    userId: string;
    image: string;
    profession: string;
    lastName: string;
    email: string;
    isPaid: boolean;
    gender: string;
    isTeamMember: number;
  }

  const BASE_URL = "https://wow-2024-server.onrender.com";
  const router = useRouter();
  const user = useAuthContext();
  const [loading, setLoadingState] = useState(false);
  const [isTeamLead, setTeamLead] = useState<boolean | undefined>(undefined);
  const [team, setTeam] = useState<Attendee[]>([]);
  const [totalUsers, setTotalUsers] = useState<Attendee[]>([]);
  const [teamSearchAutocomplete, setTeamSearchAutocomplete] =
    useState<null | Attendee>(null);
  const [teamName, setTeamName] = useState<string>("");
  const [github_profile, setGithubProfile] = useState<string>("");
  const [linkedin_profile, setLinkedinProfile] = useState<string>("");
  const [tshirt_size, setTshirtSize] = useState<string>("");
  const [isCompleteRegistration, setIsCompleteRegistration] = useState(false);

  useEffect(() => {
    if (user === null) {
      alert("Please login to register for TechSprint 2026");
      window.location.href = "/";
      return;
    }
    const ref = collection(db, "registrations");

    getDocs(
      query(
        ref,
        and(
          where("isTeamLead", "!=", 1),
          or(where("isTeamMember", "==", 0), where("isTeamMember", "==", -1))
        )
      )
    ).then((snapshot) => {
      const result = snapshot.docs.map((doc) => {
        const r = doc.data();
        return {
          label: r["firstName"],
          lastName: r["lastName"],
          userId: doc.id,
          image: r["displayPicture"],
          profession:
            r["university"] === "Other"
              ? r["otherUniversity"]
              : r["university"],
          email: r["email"],
          isPaid: r["payment_status"] == "captured",
          gender: r["gender"],
          isTeamMember: r["isTeamMember"],
        } as Attendee;
      });
      console.log(result);
      setTotalUsers(result);
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(true);
    
    try {
      if (isTeamLead === false) {
        const updatableData = {
          tshirtSize: tshirt_size,
          linkedin_profile: linkedin_profile,
          github_profile: github_profile,
          isTeamLead: 0,
          isTeamMember: 0,
        };
        console.log(updatableData);
        await updateDoc(doc(db, "registrations", user?.uid ?? ""), updatableData);
        setIsCompleteRegistration(true);
      } else {
        //CHECK IF TEAM NAME IS UNIQUE
        const isUniqueTeam =
          (
            await getCountFromServer(
              query(collection(db, "teams"), where("teamName", "==", teamName))
            )
          ).data().count <= 0;

        if (!isUniqueTeam) {
          alert("Team name must be unique");
          setLoadingState(false);
          return;
        }
        const teamNumber =
          (await getCountFromServer(query(collection(db, "teams")))).data()
            .count + 1;
        //SET ISTEAMLEAD =1 and update details of user
        const updatableData = {
          tshirtSize: tshirt_size,
          linkedin_profile: linkedin_profile,
          github_profile: github_profile,
          isTeamLead: 1,
          isTeamMember: 1,
        };
        console.log(updatableData);
        await updateDoc(doc(db, "registrations", user?.uid ?? ""), updatableData);
        //CREATE TEAM TABLE
        await setDoc(doc(db, "teams", teamName), {
          teamName: teamName,
          teamNumber: teamNumber,
          participants: team.map((e) => e.userId),
        });
        //UPDATE IS IN TEAM FOR OTHERS
        await Promise.all(
          team
            .filter((e) => e.userId != user?.uid)
            .map(async (e) => {
              const updatableData = {
                isTeamMember: 1,
              };
              console.log(updatableData);
              await updateDoc(
                doc(db, "registrations", e.userId ?? ""),
                updatableData
              );
            })
        );
        setIsCompleteRegistration(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
      setLoadingState(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-[20px] md:py-[60px] md:px-[unset] bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div className="flex flex-col justify-center items-center md:rounded-xl md:border-[1.5px] border-gray-500 dark:border-gray-700 md:w-4/5 dark:bg-[#141414]">
        <div className="w-full md:rounded-t-xl bg-[#FBBC04] flex flex-col md:flex-row p-[20px] pt-[32px] pb-4 border-gray-500 border-b-[1.5px]">
          <div className="md:grow md:pt-[30px] md:pl-[40px] pt-[20px] pb-[40px] md:pb-[unset]">
            <h1 className="text-2xl md:text-6xl font-bold">Hurray!</h1>
            <h2 className="text-xl md:text-4xl font-medium mt-2">
              We've reserved you a seat.
            </h2>

            <p className="mt-3 text-lg">TechSprint 2026</p>
            <p>andhi Institute of Technology and Management, Visakhapatnam</p>
          </div>
          <img
            src="gdsc_sc.webp"
            className="md:h-56 -scale-x-100 translate-y-1 md:translate-y-2"
          />
        </div>
        <div className="md:w-4/5 md:mr-auto md:mt-10 p-[20px] pb-0 md:p-[unset] md:ml-auto">
          <h3 className="text-xl font-medium dark:text-white">Complete your registration</h3>
          <p className="mt-2 max-w-[480px] md:text-base text-sm dark:text-gray-300">
            We need some more details from your provide the best experience and
            make sure everything is in place for you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-[20px] md:px-[unset] md:w-4/5"
        >
          <div className="mb-4 py-8 rounded-3xl w-full  flex flex-col space-y-4 md:space-y-8">
            <div className="gap-x-4 flex">
              <input
                type="url"
                id="github_profile"
                name="github_profile"
                value={github_profile}
                onChange={(e) => {
                  setGithubProfile(e.target.value);
                }}
                placeholder="GitHub Profile(Optional)"
                className="register-input w-1/2"
              />
              <input
                type="url"
                id="linkedin_profile"
                name="linkedin_profile"
                value={linkedin_profile}
                onChange={(e) => {
                  setLinkedinProfile(e.target.value);
                }}
                required
                placeholder="LinkedIn Profile"
                className="register-input w-1/2"
              />
            </div>
            <div>
              <p className="font-medium mt-1 text-lg dark:text-white">T-shirt size</p>
              <div className="space-x-4 mt-2 dark:text-gray-300">
                <div className="w-max inline-flex gap-x-3">
                  <input
                    type="radio"
                    name="tshirt-size"
                    checked={tshirt_size === "S"}
                    onChange={(e) => setTshirtSize(e.target.value)}
                    value={"S"}
                    required
                  />
                  <p>Small (S)</p>
                </div>
                <div className="w-max inline-flex  gap-x-3">
                  <input
                    type="radio"
                    name="tshirt-size"
                    checked={tshirt_size === "M"}
                    onChange={(e) => setTshirtSize(e.target.value)}
                    value={"M"}
                    required
                  />
                  <p>Medium (M)</p>
                </div>
                <div className="w-max inline-flex  gap-x-3">
                  <input
                    type="radio"
                    name="tshirt-size"
                    checked={tshirt_size === "L"}
                    onChange={(e) => setTshirtSize(e.target.value)}
                    value={"L"}
                    required
                  />
                  <p>Large (L)</p>
                </div>

                <div className="w-max inline-flex  gap-x-3">
                  <input
                    type="radio"
                    name="tshirt-size"
                    checked={tshirt_size === "XL"}
                    onChange={(e) => setTshirtSize(e.target.value)}
                    value={"XL"}
                    required
                  />
                  <p>Extra Large (XL)</p>
                </div>
                <div className="w-max inline-flex  gap-x-3">
                  <input
                    type="radio"
                    name="tshirt-size"
                    checked={tshirt_size === "XXL"}
                    onChange={(e) => setTshirtSize(e.target.value)}
                    value={"XXL"}
                    required
                  />
                  <p>Double Extra Large (XXL/2XL)</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-bold text-xl dark:text-white">Hackathon Related Information</p>
              <p className="font-medium mt-1 text-lg dark:text-white">Are you the team lead?</p>
              <p className="text-sm dark:text-gray-300">
                If you don't have a team, we can help you find one at the venue.
              </p>
              <div className="flex items-center space-x-2 mt-2 dark:text-gray-300">
                <input
                  type="radio"
                  name="isLead"
                  checked={isTeamLead == true}
                  onChange={(e) => {
                    setTeamLead(true);

                    const firstName = user?.displayName?.split(" ").at(0) ?? "";
                    const lastName =
                      user?.displayName?.replaceAll(firstName + " ", "") ?? "";
                    const currentUser = totalUsers.filter(
                      (e) => e.userId == user?.uid
                    )[0];
                    setTeam([
                      {
                        label: firstName,
                        lastName: lastName,
                        gender: currentUser?.gender ?? "He/Him",
                        isTeamMember: 0,
                        userId: user?.uid ?? "",
                        image: user?.photoURL ?? "",
                        profession: currentUser?.profession ?? "Student",
                        email: user?.email ?? "",
                        isPaid: true,
                      } as Attendee,
                    ]);
                  }}
                  required
                />
                <p>Yes</p>
                <input
                  type="radio"
                  name="isLead"
                  checked={isTeamLead == false}
                  onChange={(e) => {
                    setTeamLead(false);
                  }}
                  required
                />
                <p>No</p>
              </div>
              <div className="h-3" />

              {isTeamLead && (
                <div className="flex flex-col md:flex-row md:space-x-8 mt-2 gap-y-4 md:gap-y-[unset]">
                  <input
                    type="text"
                    id="team_name"
                    name="team_name"
                    value={teamName}
                    onChange={(e) => {
                      if (isTeamLead) {
                        setTeamName(e.target.value);
                      }
                    }}
                    disabled={!isTeamLead}
                    required
                    placeholder="Team Name"
                    className="register-input grow"
                  />
                </div>
              )}
              {isTeamLead && team.length > 0 && (
                <div className="flex flex-col md:flex-row gap-x-4">
                  {team.map((attendee, index) => (
                    <div key={index} className="inline-flex flex-col p-[20px] bg-amber-200 dark:bg-amber-900 w-max mt-3 rounded-xl">
                      <p className="text-2xl font-medium dark:text-white">{attendee.label}</p>
                      <p className="text-2xl font-medium dark:text-white">
                        {attendee.lastName}
                      </p>
                      <p className="mt-2 text-sm border-[1px] border-black dark:border-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                        {attendee.email}
                      </p>
                      {attendee.userId != user?.uid && (
                        <button
                          className="mt-2 px-6 text-white bg-black dark:bg-gray-700 h-max py-2 my-auto rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            setTeam(team.filter((_, i) => i !== index));
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                </div>
              )}
              {isTeamLead && (
                <div className="flex gap-x-8 items-center align-middle">
                  <Autocomplete
                    noOptionsText="No users found. Write to wtmvizag@gmail.com to get your teammates shortlisted"
                    className="mt-4 grow"
                    value={teamSearchAutocomplete}
                    onChange={(event, newValue) => {
                      setTeamSearchAutocomplete(newValue);
                    }}
                    getOptionLabel={(option) =>
                      option.label +
                      " " +
                      option.lastName +
                      " (" +
                      option.email +
                      ")"
                    }
                    getOptionDisabled={(o) => !o.isPaid || o.isTeamMember == -1}
                    renderOption={(props, option: Attendee) => {
                      const { key, ...otherProps } = props;
                      return (
                        <li key={key} {...otherProps}>
                          <div className="flex gap-4">
                            <img
                              src={option.image}
                              className="size-12 rounded-full object-cover"
                            />
                            <div>
                              <p>
                                {option.label} {option.lastName}
                              </p>
                              <p className="text-sm opacity-70">
                                {option.profession}
                              </p>
                          </div>
                          {!option.isPaid && <Chip label="Payment Pending" />}
                          {option.isTeamMember == -1 && option.isPaid && (
                            <Chip label="Application Incomplete" />
                          )}
                        </div>
                      </li>
                      );
                    }}
                    filterOptions={(options: Attendee[], state) => {
                      return options.filter(
                        (e) =>
                          e.email.includes(state.inputValue) ||
                          e.label.includes(state.inputValue) ||
                          e.lastName.includes(state.inputValue) ||
                          `${e.label} ${e.lastName}`.includes(state.inputValue)
                      );
                    }}
                    options={totalUsers.filter(
                      (e) =>
                        e.userId !== user?.uid &&
                        team.filter((f) => f.userId == e.userId).length <= 0
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          borderRadius: "12px",
                          
                        }}
                        label="Add team members"
                        
                      />
                    )}
                  />
                  <button
                    className="px-6 text-white bg-black dark:bg-gray-700 h-max py-2 my-auto rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      if (team.length == 4) {
                        alert("Maximum team size is 4.");
                        return;
                      }
                      if (teamSearchAutocomplete === null) {
                        return;
                      }
                      if (
                        team.filter(
                          (attendee) =>
                            attendee.email === teamSearchAutocomplete?.email
                        ).length > 0
                      ) {
                        setTeamSearchAutocomplete(null);
                        alert("This team member is already added");
                        return;
                      }
                      if (team.length >= 5) {
                        setTeamSearchAutocomplete(null);
                        alert("Team size should be within 2-4 only.");
                        return;
                      }
                      setTeam([...team, teamSearchAutocomplete!]);
                      setTeamSearchAutocomplete(null);
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
              {isTeamLead && (
                <p className="mt-2 dark:text-gray-300">
                  <b>Note</b>: Team size should be within <b>2-4 only</b>. You
                  can edit your team anytime.
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <button
              type="submit"
              className="py-2 px-6 text-blue-500 dark:text-blue-400 rounded border-neutral-300 dark:border-gray-600 border font-medium mb-16 mt-8 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </form>

        {loading && (
          <div className="absolute top-0 w-full h-full flex items-center justify-center z-10 bg-opacity-50 bg-black md:ml-[80px] text-center">
            <div className="px-[40px] md:px-[80px] pb-[40px] bg-white dark:bg-[#141414] rounded-2xl shadow-2xl mx-8 md:mx-[unset]">
              {isCompleteRegistration ? (
                <>
                  <EmojiEventsOutlined fontSize="large" className="mt-8 dark:text-white" />
                  <h2 className="text-2xl font-medium mt-4 dark:text-white">You're in.</h2>
                  <p className="text-sm mt-4 mb-8 max-w-[420px] dark:text-gray-300">
                    Excited to host you for TechSprint 2026.
                    <br />
                    Earn badges and have fun before the event.
                    <br />
                    <br />
                    Make sure to keep an eye on your email.
                  </p>
                  <button
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                    className="border-[1.5px] px-8 py-2 rounded-full border-gray-500 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <Loader></Loader>
                  <p className="font-medium dark:text-white">
                    Please wait while we process your application.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
