import Navbar from '@/components/Navbar';
import Timeline from '@/components/Timeline';

export default function TimelinePage() {
    return (
        <main className="min-h-screen bg-(--background)">
            <Navbar />
            <div className="pt-20">
                <Timeline />
            </div>

            <footer className="bg-(--io-dark) text-white py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 Google TechSprint. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
