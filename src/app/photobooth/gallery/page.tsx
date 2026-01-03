"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { PhotoLibrary, Close, FilterList } from "@mui/icons-material";

interface Photo {
  id: string;
  userName: string;
  teamName: string;
  classroom: string;
  photoUrl: string;
  printedAt: any;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filterTeam, setFilterTeam] = useState<string>("all");
  const [filterClassroom, setFilterClassroom] = useState<string>("all");
  const [teams, setTeams] = useState<string[]>([]);
  const [classrooms, setClassrooms] = useState<string[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "printQueue"),
      where("status", "==", "completed"),
      orderBy("printedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoList: Photo[] = [];
      const teamSet = new Set<string>();
      const classroomSet = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        photoList.push({
          id: doc.id,
          userName: data.userName,
          teamName: data.teamName,
          classroom: data.classroom,
          photoUrl: data.photoUrl,
          printedAt: data.printedAt,
        });

        if (data.teamName) teamSet.add(data.teamName);
        if (data.classroom) classroomSet.add(data.classroom);
      });

      setPhotos(photoList);
      setFilteredPhotos(photoList);
      setTeams(Array.from(teamSet).sort());
      setClassrooms(Array.from(classroomSet).sort());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...photos];

    if (filterTeam !== "all") {
      filtered = filtered.filter((p) => p.teamName === filterTeam);
    }

    if (filterClassroom !== "all") {
      filtered = filtered.filter((p) => p.classroom === filterClassroom);
    }

    setFilteredPhotos(filtered);
  }, [filterTeam, filterClassroom, photos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          <p className="text-white text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">📸 Photo Gallery</h1>
          <p className="text-xl text-white/80">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? "Photo" : "Photos"}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FilterList className="text-white" />
            <h2 className="text-xl font-bold text-white">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Filter by Team</label>
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all" className="bg-purple-900">All Teams ({photos.length})</option>
                {teams.map((team) => (
                  <option key={team} value={team} className="bg-purple-900">
                    {team} ({photos.filter((p) => p.teamName === team).length})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Filter by Classroom</label>
              <select
                value={filterClassroom}
                onChange={(e) => setFilterClassroom(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all" className="bg-purple-900">All Classrooms ({photos.length})</option>
                {classrooms.map((classroom) => (
                  <option key={classroom} value={classroom} className="bg-purple-900">
                    {classroom} ({photos.filter((p) => p.classroom === classroom).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(filterTeam !== "all" || filterClassroom !== "all") && (
            <button
              onClick={() => {
                setFilterTeam("all");
                setFilterClassroom("all");
              }}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <PhotoLibrary style={{ fontSize: "5rem", color: "white", opacity: 0.5 }} />
            <h2 className="text-2xl font-bold text-white mt-4">No Photos Found</h2>
            <p className="text-white/70 mt-2">
              {filterTeam !== "all" || filterClassroom !== "all"
                ? "Try adjusting your filters"
                : "Photos will appear here once they are printed"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square rounded-xl overflow-hidden border-2 border-white/20 hover:border-pink-400 transition-all transform hover:scale-105"
              >
                <img
                  src={photo.photoUrl}
                  alt={photo.userName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm truncate">{photo.userName}</p>
                    <p className="text-white/80 text-xs truncate">{photo.teamName}</p>
                    <p className="text-white/60 text-xs truncate">{photo.classroom}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <Close style={{ fontSize: "2rem" }} />
              </button>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <img
                  src={selectedPhoto.photoUrl}
                  alt={selectedPhoto.userName}
                  className="w-full max-h-[70vh] object-contain rounded-xl mb-4"
                />

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.userName}</h3>
                  <p className="text-white/80 text-lg">{selectedPhoto.teamName}</p>
                  <p className="text-white/60">{selectedPhoto.classroom}</p>
                  {selectedPhoto.printedAt && (
                    <p className="text-white/50 text-sm mt-2">
                      Printed: {new Date(selectedPhoto.printedAt.seconds * 1000).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
