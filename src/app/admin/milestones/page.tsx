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
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Assignment, Add, Edit, Delete, Check, Close, Visibility, VisibilityOff } from "@mui/icons-material";
import milestonesData from "@/data/milestones.json";

interface Milestone {
  id: string;
  title: string;
  format: string;
  time: string;
  description?: string;
  enabled: boolean;
  createdAt?: Date;
}

export default function MilestoneManagement() {
  const user = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    format: "",
    time: "",
    description: "",
    enabled: true,
  });

  useEffect(() => {
    if (user === null) {
      alert("Please login to access this page");
      router.push("/");
      return;
    }

    getDoc(doc(db, "registrations", user.uid)).then(async (document) => {
      const response = document.data();
      if (response?.role !== "admin") {
        alert("Access denied. Admin privileges required.");
        router.push("/");
      } else {
        await initializeMilestones();
        setLoading(false);
      }
    });
  }, [user, router]);

  const initializeMilestones = async () => {
    // Check if milestones collection exists
    const milestonesSnapshot = await getDocs(collection(db, "milestones"));
    
    if (milestonesSnapshot.empty) {
      // Initialize from milestones.json
      for (const milestone of milestonesData) {
        await setDoc(doc(db, "milestones", milestone.id), {
          ...milestone,
          enabled: true,
          description: "",
          createdAt: new Date(),
        });
      }
    }
    
    await fetchMilestones();
  };

  const fetchMilestones = async () => {
    const snapshot = await getDocs(collection(db, "milestones"));
    const milestonesData: Milestone[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      milestonesData.push({
        id: doc.id,
        title: data.title,
        format: data.format,
        time: data.time,
        description: data.description || "",
        enabled: data.enabled !== false,
        createdAt: data.createdAt?.toDate(),
      });
    });
    
    // Sort by milestone number
    milestonesData.sort((a, b) => {
      const aNum = parseInt(a.id.split("_")[1] || "0");
      const bNum = parseInt(b.id.split("_")[1] || "0");
      return aNum - bNum;
    });
    
    setMilestones(milestonesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing milestone
        await updateDoc(doc(db, "milestones", editingId), formData);
        alert("✅ Milestone updated successfully!");
      } else {
        // Create new milestone
        const milestoneId = `milestone_${formData.title.toLowerCase().replace(/\s+/g, "_")}`;
        await setDoc(doc(db, "milestones", milestoneId), {
          ...formData,
          createdAt: new Date(),
        });
        alert("✅ Milestone created successfully!");
      }
      
      resetForm();
      await fetchMilestones();
    } catch (error) {
      console.error("Error saving milestone:", error);
      alert("Failed to save milestone. Please try again.");
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setFormData({
      title: milestone.title,
      format: milestone.format,
      time: milestone.time,
      description: milestone.description || "",
      enabled: milestone.enabled,
    });
    setEditingId(milestone.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "milestones", id));
      alert("✅ Milestone deleted successfully!");
      await fetchMilestones();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      alert("Failed to delete milestone. Please try again.");
    }
  };

  const toggleEnabled = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "milestones", id), {
        enabled: !currentStatus,
      });
      await fetchMilestones();
    } catch (error) {
      console.error("Error toggling milestone status:", error);
      alert("Failed to update milestone status.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      format: "",
      time: "",
      description: "",
      enabled: true,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Assignment className="text-blue-500" fontSize="large" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Milestone Management
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Configure and manage hackathon milestones
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Add />
                Add Milestone
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? "Edit Milestone" : "Add New Milestone"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Close />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="MILESTONE #X: Title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Day *
                  </label>
                  <select
                    required
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
                  >
                    <option value="">-- Select Day --</option>
                    <option value="Day 1">Day 1</option>
                    <option value="Day 2">Day 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Time (HH:MM) *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Enable milestone
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this milestone..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Check />
                  {editingId ? "Update Milestone" : "Create Milestone"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Current Milestones ({milestones.length})
          </h2>
          
          {milestones.length === 0 ? (
            <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-500 dark:text-gray-400">No milestones configured yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`rounded-xl p-6 border-2 transition-all ${
                    milestone.enabled
                      ? "bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-700"
                      : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {milestone.format} • {milestone.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEnabled(milestone.id, milestone.enabled)}
                        className={`p-2 rounded-lg transition-colors ${
                          milestone.enabled
                            ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title={milestone.enabled ? "Disable" : "Enable"}
                      >
                        {milestone.enabled ? <Visibility /> : <VisibilityOff />}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(milestone)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(milestone.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Delete />
                      </button>
                    </div>
                  </div>
                  
                  {milestone.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {milestone.description}
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      milestone.enabled
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                      {milestone.enabled ? "Active" : "Disabled"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {milestone.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
            ℹ️ Milestone Management Guide
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• <strong>Enable/Disable:</strong> Toggle visibility without deleting</li>
            <li>• <strong>Edit:</strong> Update milestone details at any time</li>
            <li>• <strong>Delete:</strong> Permanently remove milestone (use with caution)</li>
            <li>• <strong>Milestone IDs:</strong> Used in database, cannot be changed after creation</li>
            <li>• <strong>Time Format:</strong> Use 24-hour format (HH:MM)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
