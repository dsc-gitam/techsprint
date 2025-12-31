export default function Timeline() {
    const events = [
        {
            date: "Dec 17",
            title: "Google AI Suite Session",
            description: "Deep dive into Gemini and Google Cloud AI tools.",
            completed: true,
            color: "var(--google-blue)"
        },
        {
            date: "Dec 26",
            title: "Pitch Deck Workshop",
            description: "Learn how to craft a winning pitch deck for your project.",
            completed: true,
            color: "var(--google-red)"
        },
        {
            date: "Jan 1",
            title: "Registration Deadline",
            description: "Last day to register, form teams, and submit pitch decks.",
            completed: false,
            color: "var(--google-yellow)"
        },
        {
            date: "Jan 3",
            title: "TechSprint Hackathon",
            description: "The main event! 24 hours of building and innovation.",
            completed: false,
            color: "var(--google-green)"
        }
    ];

    return (
        <section id="timeline" className="py-20 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center mb-16 text-[var(--foreground)]">Event Timeline</h2>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-black/10 dark:bg-white/10 hidden md:block"></div>

                    <div className="space-y-12">
                        {events.map((event, index) => (
                            <div key={index} className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="w-full md:w-5/12"></div>

                                <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-[#000000] border-4 shadow-lg mb-4 md:mb-0" style={{ borderColor: event.color }}>
                                    {event.completed && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color }}></div>}
                                </div>

                                <div className="w-full md:w-5/12 bg-white dark:bg-[#121212]/80 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border-t-4 dark:border-white/10!" style={{ borderColor: event.color }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold uppercase tracking-wider text-black/50 dark:text-white">{event.date}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${event.completed ? 'bg-green-100 text-green-800 dark:bg-black dark:text-white  font-medium' : 'bg-gray-100 dark:bg-white/30 text-gray-800 dark:text-white/80 font-medium'}`}>
                                            {event.completed ? 'Completed' : 'Upcoming'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">{event.title}</h3>
                                    <p className="text-black/60 dark:text-white/60">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
