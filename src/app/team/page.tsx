'use client'

import React, { useState, useEffect } from 'react';
import SpeakerSocialMedia from '@/components/SpeakerSocialMedia';
import sessionsJSON from '@/data/sessions.json';
import speakersJSON from '@/data/speakers.json';

type Session = {
  id?: string;
  title: string;
  timeDuration: string;
  speakers: number[];
};

const SpeakerCard = ({ item }: { item: any }) => {
  const [dialog, setDialog] = useState(false);
  const [speakerSessions, setSpeakerSessions] = useState<Session[]>([]);

  const getProfileImage = (img: any) => {
    if (img.length === 0) {
      return '/assets/img/common/avatar.jpg';
    }
    if (img.includes("http")) {
      return img;
    }
    if (img.includes("team/")) {
      return `/assets/img/team/${img.split("team/")[1]}`;
    }
    return `/assets/img/speakers/${img}`;
  };

  const getSessionsInfo = (spid: any) => {
    const filteredSessions: Session[] = [];
    sessionsJSON.forEach((session) => {
      if ((session.speakers as any[]).includes(parseInt(spid))) {
        filteredSessions.push(session);
      }
    });
    setSpeakerSessions(filteredSessions);
  };

  useEffect(() => {
    if (dialog && item && item.id) {
      getSessionsInfo(item.id);
    }
  }, [dialog, item]);

  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
        onClick={() => setDialog(true)}
      >
        <div className="p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700">
            <img
              src={getProfileImage(item.image)}
              alt={item.name}
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {item.company?.name}
          </p>
        </div>
      </div>

      {/* Modal */}
      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDialog(false)}
        >
          <div
            className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-gray-800">
                  <img
                    src={getProfileImage(item.image)}
                    alt={item.name}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h2>
                  {item.company?.name && (
                    <div className="text-gray-600 dark:text-gray-300">
                      <p className="font-medium">
                        {item.company.name}, {item.company.designation}
                      </p>
                      <p className="text-sm mt-1 opacity-80 whitespace-pre-line">
                        {item.community_title}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {item.bio && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Bio</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                    {item.bio}
                  </p>
                </div>
              )}

              {/* Social Media */}
              <div className="mb-8">
                <SpeakerSocialMedia
                  className="flex gap-4"
                  item={item.social}
                />
              </div>

              {/* Sessions */}
              {speakerSessions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {speakerSessions.length > 1 ? 'Sessions' : 'Session'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {speakerSessions.map((session, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {session.title}
                        </h4>
                        <span className="inline-block bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-md font-medium border border-blue-100 dark:border-blue-800">
                          {session.timeDuration} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setDialog(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function SpeakerPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Team
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Before the clock starts ticking, hear from innovators who will help you sharpen your focus and build with confidence.
          </p>
        </div>

        {speakersJSON.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {speakersJSON.map((s: any, index: number) => (
              <SpeakerCard key={index} item={s} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              📢 Speakers yet to be announced. Stay tuned!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};