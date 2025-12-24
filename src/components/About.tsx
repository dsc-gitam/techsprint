export default function About() {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#202124]">
                            Innovate with{' '}
                            <span style={{
                                background: 'linear-gradient(90deg, #4285F4 0%, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC04 50%, #FBBC04 75%, #34A853 75%, #34A853 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>Google</span>{' '}
                            Tech
                        </h2>
                        <p className="text-lg text-[#5f6368] mb-6 leading-relaxed">
                            <strong className="text-[#202124]">Google TechSprint</strong> is your chance to build solutions for real-world problems using the latest Google technologies. Whether you&apos;re into <span className="text-[#4285F4] font-semibold">AI</span>, <span className="text-[#EA4335] font-semibold">Cloud</span>, <span className="text-[#FBBC04] font-semibold">Mobile</span>, or <span className="text-[#34A853] font-semibold">Web</span>, there&apos;s a track for you.
                        </p>
                        <p className="text-lg text-[#5f6368] mb-8 leading-relaxed">
                            Connect with fellow developers, learn from experts, and showcase your skills. Winners get exciting prizes and opportunities to network with industry leaders.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl border-l-4 border-[var(--google-blue)] shadow-sm">
                                <h4 className="font-bold text-xl mb-1 text-[var(--io-dark)]">48 Hours</h4>
                                <p className="text-sm text-gray-600">Non-stop coding</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl border-l-4 border-[var(--google-red)] shadow-sm">
                                <h4 className="font-bold text-xl mb-1 text-[var(--io-dark)]">Mentorship</h4>
                                <p className="text-sm text-gray-600">From Google Experts</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl border-l-4 border-[var(--google-yellow)] shadow-sm">
                                <h4 className="font-bold text-xl mb-1 text-[var(--io-dark)]">Prizes</h4>
                                <p className="text-sm text-gray-600">Exciting rewards</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl border-l-4 border-[var(--google-green)] shadow-sm">
                                <h4 className="font-bold text-xl mb-1 text-[var(--io-dark)]">Networking</h4>
                                <p className="text-sm text-gray-600">Global community</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 text-[var(--io-dark)]">Why Participate?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--google-blue)] flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                                    <p className="ml-4 text-gray-700">Get hands-on experience with <strong>Gemini</strong>, <strong>Firebase</strong>, and <strong>Google Cloud</strong>.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--google-red)] flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                                    <p className="ml-4 text-gray-700">Build a <strong>portfolio-worthy project</strong> in just one weekend.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--google-yellow)] flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                                    <p className="ml-4 text-gray-700">Receive <strong>feedback from industry professionals</strong>.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--google-green)] flex items-center justify-center text-white text-sm font-bold mt-0.5">4</div>
                                    <p className="ml-4 text-gray-700">Fun, food, and <strong>swag</strong> for all participants!</p>
                                </li>
                            </ul>
                        </div>
                        <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="h-64 w-full object-cover rounded-2xl border-2 border-[var(--io-dark)] mt-8 shadow-lg" alt="Google I/O Event" />
                    </div>
                </div>
            </div>
        </section>
    );
}

