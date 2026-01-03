"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { 
  getDoc, 
  doc, 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc,
  query,
  where,
  serverTimestamp 
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { PeopleOutline, QrCode2, CheckCircle, Close } from "@mui/icons-material";
import Image from "next/image";
import classrooms from "@/data/classrooms.json";

interface Participant {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  gender: string;
  displayPicture: string;
  payment_status: string;
}

export default function AdminTeams() {
  const user = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [allottedClassroom, setAllottedClassroom] = useState("");
  const [creating, setCreating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedForPayment, setSelectedForPayment] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) {
      alert("Please login to access admin panel");
      router.push("/");
      return;
    }

    getDoc(doc(db, "registrations", user.uid)).then(async (document) => {
      const response = document.data();
      if (response?.role === "admin" || response?.role === "staff") {
        setIsAdmin(true);
        // Fetch all participants without team
        const registrationsRef = collection(db, "registrations");
        const q = query(registrationsRef, where("teamCode", "==", null));
        const snapshot = await getDocs(q);
        const participantsList: Participant[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          participantsList.push({
            uid: doc.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            university: data.university === "Other" ? data.otherUniversity : data.university,
            gender: data.gender,
            displayPicture: data.displayPicture,
            payment_status: data.payment_status || "pending",
          });
        });
        setParticipants(participantsList);
        setLoading(false);
      } else {
        alert("Access denied. Admin privileges required.");
        router.push("/");
      }
    });
  }, [user, router]);

  const generateTeamCode = () => {
    return 'TEAM' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateTeam = async () => {
    if (!teamName || selectedParticipants.length === 0 || !teamLeader) {
      alert("Please provide team name, select participants, and assign a team leader.");
      return;
    }

    if (!selectedParticipants.includes(teamLeader)) {
      alert("Team leader must be one of the selected participants.");
      return;
    }

    setCreating(true);
    try {
      const teamCode = generateTeamCode();

      // Create team document
      await setDoc(doc(db, "teams", teamCode), {
        teamCode,
        teamName,
        leaderId: teamLeader,
        memberIds: selectedParticipants,
        allottedClassroom: allottedClassroom || "",
        problemStatement: "",
        solution: "",
        techStack: "",
        createdAt: serverTimestamp(),
      });

      // Update all participants
      for (const uid of selectedParticipants) {
        await updateDoc(doc(db, "registrations", uid), {
          teamCode,
          role: uid === teamLeader ? "leader" : "participant",
          updatedAt: serverTimestamp(),
        });
      }

      alert(`Team "${teamName}" created successfully with code: ${teamCode}`);
      
      // Reset form
      setTeamName("");
      setSelectedParticipants([]);
      setTeamLeader("");
      setAllottedClassroom("");
      
      // Refresh participants list
      const registrationsRef = collection(db, "registrations");
      const q = query(registrationsRef, where("teamCode", "==", null));
      const snapshot = await getDocs(q);
      const participantsList: Participant[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        participantsList.push({
          uid: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          university: data.university === "Other" ? data.otherUniversity : data.university,
          gender: data.gender,
          displayPicture: data.displayPicture,
          payment_status: data.payment_status || "pending",
        });
      });
      setParticipants(participantsList);
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleParticipant = (uid: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleConfirmPayment = async (uid: string) => {
    try {
      await updateDoc(doc(db, "registrations", uid), {
        payment_status: "captured",
        updatedAt: serverTimestamp(),
      });
      
      // Update local state
      setParticipants((prev) =>
        prev.map((p) =>
          p.uid === uid ? { ...p, payment_status: "captured" } : p
        )
      );
      
      setShowQR(false);
      setSelectedForPayment(null);
      alert("Payment confirmed successfully!");
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Failed to confirm payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create teams and manage participant payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Team Form */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PeopleOutline /> Create New Team
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Team Leader <span className="text-red-500">*</span>
                </label>
                <select
                  value={teamLeader}
                  onChange={(e) => setTeamLeader(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={selectedParticipants.length === 0}
                >
                  <option value="">Select team leader</option>
                  {selectedParticipants.map((uid) => {
                    const participant = participants.find((p) => p.uid === uid);
                    return (
                      <option key={uid} value={uid}>
                        {participant?.firstName} {participant?.lastName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Allotted Classroom
                </label>
                <select
                  value={allottedClassroom}
                  onChange={(e) => setAllottedClassroom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No classroom assigned</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.name}>
                      {classroom.name} - {classroom.building} (Capacity: {classroom.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Selected: {selectedParticipants.length} participant(s)
                </p>
              </div>

              <button
                onClick={handleCreateTeam}
                disabled={creating || selectedParticipants.length === 0 || !teamName || !teamLeader}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? "Creating..." : "Create Team"}
              </button>
            </div>
          </div>

          {/* Participants List */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Available Participants ({participants.length})
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {participants.map((participant) => (
                <div
                  key={participant.uid}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedParticipants.includes(participant.uid)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(participant.uid)}
                      onChange={() => handleToggleParticipant(participant.uid)}
                      className="mt-1"
                    />
                    <img
                      src={participant.displayPicture}
                      className="w-12 h-12 rounded-full"
                      alt={participant.firstName}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {participant.firstName} {participant.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{participant.university}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{participant.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          participant.gender === "He/Him"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                        }`}
                      >
                        {participant.gender}
                      </span>
                      {participant.payment_status === "captured" ? (
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle fontSize="small" /> Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedForPayment(participant.uid);
                            setShowQR(true);
                          }}
                          className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1"
                        >
                          <QrCode2 fontSize="small" /> Show QR
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {participants.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No participants available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment QR Modal */}
      {showQR && selectedForPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#141414] rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment QR Code</h3>
              <button
                onClick={() => {
                  setShowQR(false);
                  setSelectedForPayment(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Close />
              </button>
            </div>

            <div className="mb-4">
              {(() => {
                const participant = participants.find((p) => p.uid === selectedForPayment);
                return (
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment for: <span className="font-medium text-gray-900 dark:text-white">
                        {participant?.firstName} {participant?.lastName}
                      </span>
                    </p>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-center mb-6">
              <img
                src="/images/payment-QR.png"
                alt="Payment QR Code"
                className="w-64 h-64 object-contain border border-gray-200 dark:border-gray-700 rounded-lg"
              />
            </div>

            <button
              onClick={() => handleConfirmPayment(selectedForPayment)}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Confirm Payment Received
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
