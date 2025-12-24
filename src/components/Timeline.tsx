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
            completed: false,
            color: "var(--google-red)"
        },
        {
            date: "Dec 31",
            title: "Registration Deadline",
            description: "Last day to register, form teams, and submit pitch decks.",
            completed: false,
            color: "var(--google-yellow)"
        },
        {
            date: "Jan 3",
            title: "TechSprint Hackathon",
            description: "The main event! 48 hours of building and innovation.",
            completed: false,
            color: "var(--google-green)"
        }
    ];

    return (
        <section id="timeline" className="py-20 bg-[var(--io-light-gray)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center mb-16 text-[var(--foreground)]">Event Timeline</h2>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden md:block"></div>

                    <div className="space-y-12">
                        {events.map((event, index) => (
                            <div key={index} className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="w-full md:w-5/12"></div>

                                <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 shadow-lg mb-4 md:mb-0" style={{ borderColor: event.color }}>
                                    {event.completed && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color }}></div>}
                                </div>

                                <div className="w-full md:w-5/12 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border-t-4" style={{ borderColor: event.color }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">{event.date}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${event.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {event.completed ? 'Completed' : 'Upcoming'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">{event.title}</h3>
                                    <p className="text-gray-600">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
