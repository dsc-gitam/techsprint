"use client";
import React, { useState } from "react";
import scheduleJSON from "@/data/schedule.json";
import sessionsJSON from "@/data/sessions.json";
import ScheduleDetails from "@/components/schedule/schedule_details";

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const scheduleInfo = scheduleJSON.map(day => ({
    ...day,
    schedule: day.schedule.map(slot => {
      const session = sessionsJSON.find(s => s.id === slot.session.toString());
      return {
        time: session?.time || `${slot.startTime} - ${slot.endTime}`,
        event: session?.title || "Event",
        venue: session?.track || "",
        duration: session?.timeDuration ? `${session.timeDuration}min` : ""
      };
    })
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center">
          <div className="text-center mb-10 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
              Schedule
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Follow code demonstrations by our expert speakers on different
              tracks. Check out the schedule below and don't forget to mark
              your calendar so that you don't miss out on any sessions.
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="flex justify-center gap-12 mb-16 border-b border-gray-200 dark:border-gray-800 w-full max-w-md">
            {scheduleInfo.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 relative ${activeTab === index
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
              >
                {item.date}
                {activeTab === index && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400 rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full max-w-5xl">
            {scheduleInfo.map((item, index) => (
              <div
                key={index}
                className={`${activeTab === index ? "block" : "hidden"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <ScheduleDetails data={item.schedule} date={item.date} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
