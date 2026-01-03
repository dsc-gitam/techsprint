"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Dashboard,
  Person,
  CardGiftcard,
  CameraAlt,
  Group,
  PersonAdd,
  Search,
  Download,
} from "@mui/icons-material";

interface CheckinRecord {
  id: string;
  userId: string;
  teamCode: string;
  type: string;
  timestamp: any;
  scannedBy: string;
  location: string;
}

interface UserStats {
  userId: string;
  name: string;
  email: string;
  teamCode: string;
  teamName: string;
  checkIns: CheckinRecord[];
  checkOuts: CheckinRecord[];
  swagDelivered: boolean;
  photoboothCount: number;
}

export default function Analytics() {
  const user = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "teams">("overview");

  useEffect(() => {
    if (user === null) {
      alert("Please login to access analytics");
      router.push("/");
      return;
    }

    getDoc(doc(db, "registrations", user.uid)).then(async (document) => {
      const response = document.data();
      if (response?.role === "admin" || response?.role === "staff") {
        setIsStaff(true);
        await fetchAllData();
        setLoading(false);
      } else {
        alert("Access denied. Staff privileges required.");
        router.push("/");
      }
    });
  }, [user, router]);

  const fetchAllData = async () => {
    try {
      // Fetch checkins
      const checkinsSnapshot = await getDocs(collection(db, "checkins"));
      const checkinsData: CheckinRecord[] = [];
      checkinsSnapshot.forEach((doc) => {
        checkinsData.push({ id: doc.id, ...doc.data() } as CheckinRecord);
      });
      setCheckins(checkinsData);

      // Fetch registrations
      const regsSnapshot = await getDocs(collection(db, "registrations"));
      const regsData: any[] = [];
      regsSnapshot.forEach((doc) => {
        regsData.push({ uid: doc.id, ...doc.data() });
      });
      setRegistrations(regsData);

      // Fetch teams
      const teamsSnapshot = await getDocs(collection(db, "teams"));
      const teamsData: any[] = [];
      teamsSnapshot.forEach((doc) => {
        teamsData.push({ id: doc.id, ...doc.data() });
      });
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserStats = (userId: string): UserStats | null => {
    const registration = registrations.find((r) => r.uid === userId);
    if (!registration) return null;

    const userCheckins = checkins.filter((c) => c.userId === userId);
    const team = teams.find((t) => t.teamCode === registration.teamCode);

    return {
      userId,
      name: `${registration.firstName} ${registration.lastName}`,
      email: registration.email,
      teamCode: registration.teamCode || "",
      teamName: team?.teamName || "No Team",
      checkIns: userCheckins.filter((c) => c.type === "check-in"),
      checkOuts: userCheckins.filter((c) => c.type === "check-out"),
      swagDelivered: userCheckins.some((c) => c.type === "swag"),
      photoboothCount: userCheckins.filter((c) => c.type === "photobooth").length,
    };
  };

  const getTeamStats = (teamCode: string) => {
    const team = teams.find((t) => t.teamCode === teamCode);
    if (!team) return null;

    const teamMembers = registrations.filter((r) => r.teamCode === teamCode);
    const teamCheckins = checkins.filter((c) => c.teamCode === teamCode);

    return {
      teamCode,
      teamName: team.teamName,
      classroom: team.allottedClassroom || "Not Assigned",
      memberCount: teamMembers.length,
      checkInsCount: teamCheckins.filter((c) => c.type === "check-in").length,
      checkOutsCount: teamCheckins.filter((c) => c.type === "check-out").length,
      swagDelivered: teamCheckins.filter((c) => c.type === "swag").length,
      photoboothUsed: teamCheckins.filter((c) => c.type === "photobooth").length,
    };
  };

  const exportToCSV = () => {
    const csvData = checkins.map((c) => ({
      Timestamp: c.timestamp?.toDate?.()?.toLocaleString() || "N/A",
      Type: c.type,
      UserID: c.userId,
      TeamCode: c.teamCode || "N/A",
      ScannedBy: c.scannedBy,
      Location: c.location,
    }));

    const headers = Object.keys(csvData[0]);
    const csvString = [
      headers.join(","),
      ...csvData.map((row) => headers.map((header) => row[header as keyof typeof row]).join(",")),
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `techsprint-attendance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isStaff) {
    return null;
  }

  const stats = {
    totalCheckins: checkins.filter((c) => c.type === "check-in").length,
    totalCheckouts: checkins.filter((c) => c.type === "check-out").length,
    swagDelivered: checkins.filter((c) => c.type === "swag").length,
    photoboothUsed: checkins.filter((c) => c.type === "photobooth").length,
    uniqueAttendees: new Set(checkins.map((c) => c.userId)).size,
    totalTeams: teams.length,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Dashboard className="text-blue-500" fontSize="large" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time attendance, swag delivery, and photobooth tracking
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <PersonAdd className="text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Check-ins</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalCheckins}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <PersonAdd className="text-orange-600 dark:text-orange-400 mb-2" style={{ transform: "scaleX(-1)" }} />
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Check-outs</p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.totalCheckouts}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <CardGiftcard className="text-purple-600 dark:text-purple-400 mb-2" />
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Swag Delivered</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.swagDelivered}</p>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <CameraAlt className="text-pink-600 dark:text-pink-400 mb-2" />
            <p className="text-sm text-pink-600 dark:text-pink-400 mb-1">Photobooth</p>
            <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">{stats.photoboothUsed}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <Person className="text-green-600 dark:text-green-400 mb-2" />
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Unique Attendees</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.uniqueAttendees}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <Group className="text-yellow-600 dark:text-yellow-400 mb-2" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Total Teams</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.totalTeams}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "users"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              User Search
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "teams"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Team Stats
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
                  >
                    <option value="all">All Actions</option>
                    <option value="check-in">Check-ins Only</option>
                    <option value="check-out">Check-outs Only</option>
                    <option value="swag">Swag Only</option>
                    <option value="photobooth">Photobooth Only</option>
                  </select>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {checkins
                    .filter((c) => filterType === "all" || c.type === filterType)
                    .sort((a, b) => (b.timestamp?.toDate?.()?.getTime() || 0) - (a.timestamp?.toDate?.()?.getTime() || 0))
                    .map((record) => {
                      const userReg = registrations.find((r) => r.uid === record.userId);
                      return (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            {userReg?.displayPicture && (
                              <img src={userReg.displayPicture} className="w-10 h-10 rounded-full" alt="" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {userReg?.firstName} {userReg?.lastName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {record.type.toUpperCase()} • {record.timestamp?.toDate?.()?.toLocaleString() || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {record.teamCode || "No Team"}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  {checkins.filter((c) => filterType === "all" || c.type === filterType).length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No records found</p>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {registrations
                    .filter(
                      (r) =>
                        searchQuery === "" ||
                        r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((reg) => {
                      const stats = getUserStats(reg.uid);
                      if (!stats) return null;

                      return (
                        <div
                          key={reg.uid}
                          className="bg-white dark:bg-[#0a0a0a] rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start gap-4 mb-3">
                            <img src={reg.displayPicture} className="w-12 h-12 rounded-full" alt="" />
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white">{stats.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{stats.email}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Team: {stats.teamName}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                              <p className="text-xs text-blue-600 dark:text-blue-400">Check-ins</p>
                              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                {stats.checkIns.length}
                              </p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2">
                              <p className="text-xs text-orange-600 dark:text-orange-400">Check-outs</p>
                              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                {stats.checkOuts.length}
                              </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                              <p className="text-xs text-purple-600 dark:text-purple-400">Swag</p>
                              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                {stats.swagDelivered ? "✅" : "❌"}
                              </p>
                            </div>
                            <div className="bg-pink-50 dark:bg-pink-900/20 rounded p-2">
                              <p className="text-xs text-pink-600 dark:text-pink-400">Photobooth</p>
                              <p className="text-lg font-bold text-pink-700 dark:text-pink-300">
                                {stats.photoboothCount}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Teams Tab */}
            {activeTab === "teams" && (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {teams.map((team) => {
                  const stats = getTeamStats(team.teamCode);
                  if (!stats) return null;

                  return (
                    <div
                      key={team.id}
                      className="bg-white dark:bg-[#0a0a0a] rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{stats.teamName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stats.teamCode} • {stats.classroom}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {stats.memberCount} members
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                          <p className="text-xs text-blue-600 dark:text-blue-400">Check-ins</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                            {stats.checkInsCount}
                          </p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2">
                          <p className="text-xs text-orange-600 dark:text-orange-400">Check-outs</p>
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                            {stats.checkOutsCount}
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                          <p className="text-xs text-purple-600 dark:text-purple-400">Swag</p>
                          <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                            {stats.swagDelivered}
                          </p>
                        </div>
                        <div className="bg-pink-50 dark:bg-pink-900/20 rounded p-2">
                          <p className="text-xs text-pink-600 dark:text-pink-400">Photobooth</p>
                          <p className="text-lg font-bold text-pink-700 dark:text-pink-300">
                            {stats.photoboothUsed}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
