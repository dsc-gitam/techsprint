import React, { useState } from 'react';

interface ScheduleItem {
    time: string;
    event: string;
    venue: string;
    duration: string;
}

interface ScheduleDetailsProps {
    data: ScheduleItem[];
    date?: string;
}

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({ data, date }) => {
    const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

    // Helper to format date for the modal
    const getFormattedDate = () => {
        if (date === "Day 1") return "Mar 24, 2026";
        if (date === "Day 2") return "Mar 25, 2026";
        return date || "Mar 24, 2026";
    };

    return (
        <>
            <div className="flex flex-col w-full max-w-5xl mx-auto">
                {data.map((item, index) => {
                    const eventName = item.event || "";
                    const isMilestone = eventName.toLowerCase().includes('milestone');
                    const [startTime, endTime] = (item.time || "").split('-').map(t => t.trim());

                    if (isMilestone) {
                        return (
                            <div key={index} className="py-8 w-full">
                                <div className="bg-[#FFF8E1] text-[#F57C00] py-4 px-6 rounded-xl flex items-center justify-center gap-3 w-full shadow-sm border border-[#FFE0B2]">
                                    <span className="text-2xl">🏆</span>
                                    <span className="font-bold tracking-wide uppercase text-sm md:text-base">
                                        {item.event.toUpperCase()}: {item.venue || "CHECKPOINT"}
                                    </span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={index}
                            onClick={() => setSelectedEvent(item)}
                            className="flex flex-col md:flex-row py-8 border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl px-4 -mx-4"
                        >
                            {/* Time Column */}
                            <div className="w-full md:w-1/4 flex flex-col items-start md:items-end md:pr-12 mb-4 md:mb-0">
                                <span className="text-2xl font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {startTime}
                                </span>
                                {endTime && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {endTime}
                                    </span>
                                )}
                                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                                    GMT (+05:30)
                                </span>
                            </div>

                            {/* Event Column */}
                            <div className="w-full md:w-3/4 flex flex-col items-start pl-0 md:pl-8 border-l-0 md:border-l border-gray-100 dark:border-gray-800 relative">
                                {/* Dot on timeline */}
                                <div className="hidden md:block absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-500 transition-colors"></div>

                                <h3 className="text-xl text-gray-800 dark:text-gray-100 font-normal mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.event}
                                </h3>

                                {item.venue && (
                                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm px-4 py-1.5 rounded-full font-medium">
                                        {item.venue}
                                    </span>
                                )}

                                {item.duration && !item.venue && (
                                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm px-4 py-1.5 rounded-full font-medium">
                                        {item.duration}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedEvent(null)}>
                    <div
                        className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                {selectedEvent.event}
                            </h2>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{getFormattedDate()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{selectedEvent.time} (IST)</span>
                                </div>
                                {(selectedEvent.venue || selectedEvent.duration) && (
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                                        {selectedEvent.venue || selectedEvent.duration}
                                    </span>
                                )}
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Overview</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Join us for {selectedEvent.event}. This session will cover key aspects and provide valuable insights. Don't miss out on this opportunity to learn and connect!
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors uppercase tracking-wide text-sm"
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

export default ScheduleDetails;
