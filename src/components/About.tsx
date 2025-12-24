export default function About() {
    return (
        <section id="about" className="py-8 sm:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch">
                    <div className="flex flex-col">
                        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6 text-[#202124]">
                            Innovate with{' '}
                            <span className="text-[#4285F4]">G</span>
                            <span className="text-[#EA4335]">o</span>
                            <span className="text-[#FBBC04]">o</span>
                            <span className="text-[#4285F4]">g</span>
                            <span className="text-[#34A853]">l</span>
                            <span className="text-[#EA4335]">e</span>
                            {' '}Tech
                        </h2>
                        <p className="text-base sm:text-lg text-[#5f6368] mb-4 sm:mb-6 leading-relaxed">
                            <strong className="text-[#202124]">Google TechSprint</strong> is your chance to build solutions for real-world problems using the latest Google technologies. Whether you&apos;re into <span className="text-[#4285F4] font-semibold">AI</span>, <span className="text-[#EA4335] font-semibold">Cloud</span>, <span className="text-[#FBBC04] font-semibold">Mobile</span>, or <span className="text-[#34A853] font-semibold">Web</span>, there&apos;s a track for you.
                        </p>
                        <p className="text-base sm:text-lg text-[#5f6368] mb-6 sm:mb-8 leading-relaxed">
                            Connect with fellow developers, learn from experts, and showcase your skills. Winners get exciting prizes and opportunities to network with industry leaders.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-auto">
                            <div className="p-4 sm:p-5 bg-[#f8f9fa] rounded-xl border-l-4 border-[#4285F4] shadow-sm">
                                <h4 className="font-bold text-base sm:text-xl mb-1 text-[#202124]">48 Hours</h4>
                                <p className="text-sm sm:text-base text-[#5f6368]">Non-stop coding</p>
                            </div>
                            <div className="p-4 sm:p-5 bg-[#f8f9fa] rounded-xl border-l-4 border-[#EA4335] shadow-sm">
                                <h4 className="font-bold text-base sm:text-xl mb-1 text-[#202124]">Mentorship</h4>
                                <p className="text-sm sm:text-base text-[#5f6368]">From Google Experts</p>
                            </div>
                            <div className="p-4 sm:p-5 bg-[#f8f9fa] rounded-xl border-l-4 border-[#FBBC04] shadow-sm">
                                <h4 className="font-bold text-base sm:text-xl mb-1 text-[#202124]">Prizes</h4>
                                <p className="text-sm sm:text-base text-[#5f6368]">Exciting rewards</p>
                            </div>
                            <div className="p-4 sm:p-5 bg-[#f8f9fa] rounded-xl border-l-4 border-[#34A853] shadow-sm">
                                <h4 className="font-bold text-base sm:text-xl mb-1 text-[#202124]">Networking</h4>
                                <p className="text-sm sm:text-base text-[#5f6368]">Global community</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Why Participate */}
                    <div className="flex flex-col">
                        <div className="relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#202124]">Why Participate?</h3>
                            <ul className="space-y-3 sm:space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#4285F4] flex items-center justify-center text-white text-xs sm:text-sm font-bold mt-0.5">1</div>
                                    <p className="ml-3 sm:ml-4 text-sm sm:text-base text-[#5f6368]">Get hands-on experience with <strong className="text-[#202124]">Gemini</strong>, <strong className="text-[#202124]">Firebase</strong>, and <strong className="text-[#202124]">Google Cloud</strong>.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EA4335] flex items-center justify-center text-white text-xs sm:text-sm font-bold mt-0.5">2</div>
                                    <p className="ml-3 sm:ml-4 text-sm sm:text-base text-[#5f6368]">Build a <strong className="text-[#202124]">portfolio-worthy project</strong> in just one weekend.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FBBC04] flex items-center justify-center text-white text-xs sm:text-sm font-bold mt-0.5">3</div>
                                    <p className="ml-3 sm:ml-4 text-sm sm:text-base text-[#5f6368]">Receive <strong className="text-[#202124]">feedback from industry professionals</strong>.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#34A853] flex items-center justify-center text-white text-xs sm:text-sm font-bold mt-0.5">4</div>
                                    <p className="ml-3 sm:ml-4 text-sm sm:text-base text-[#5f6368]">Fun, food, and <strong className="text-[#202124]">swag</strong> for all participants!</p>
                                </li>
                            </ul>
                        </div>
                        <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="h-48 sm:h-64 w-full object-cover rounded-xl sm:rounded-2xl border-2 border-[#202124] mt-6 sm:mt-8 shadow-lg" alt="Google I/O Event" />
                    </div>
                </div>
            </div>
        </section>
    );
}
