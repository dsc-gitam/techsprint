export default function About() {
    return (
        <section id="about" className="py-12 md:py-20 bg-black/5 dark:bg-[#101010]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4 md:mb-6 text-(--foreground)/90">
                            Innovate with <span className="text-black dark:text-white">Google</span> Tech
                        </h2>
                        <p className="text-base md:text-lg text-black/60 dark:text-white/60 mb-4 md:mb-6">
                            Google TechSprint is your chance to build solutions for real-world problems using the latest Google technologies. Whether you're into AI, Cloud, Mobile, or Web, there's a track for you.
                        </p>
                        <p className="text-base md:text-lg text-black/60 dark:text-white/60 mb-6 md:mb-8">
                            Connect with fellow developers, learn from experts, and showcase your skills. Winners get exciting prizes and opportunities to network with industry leaders.
                        </p>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="p-3 md:p-4 bg-white dark:bg-[#141414] rounded-xl">
                                <h4 className="font-bold text-lg md:text-xl mb-1 text-black dark:text-white">24 Hours</h4>
                                <p className="text-xs md:text-sm text-black/60 dark:text-white/60">Non-stop coding</p>
                            </div>
                            <div className="p-3 md:p-4 bg-white dark:bg-[#141414] rounded-xl">
                                <h4 className="font-bold text-lg md:text-xl mb-1 text-black dark:text-white">Mentorship</h4>
                                <p className="text-xs md:text-sm text-black/60 dark:text-white/60">From Google Experts</p>
                            </div>
                            <div className="p-3 md:p-4 bg-white dark:bg-[#141414] rounded-xl">
                                <h4 className="font-bold text-lg md:text-xl mb-1 text-black dark:text-white">Cash Prizes</h4>
                                <p className="text-xs md:text-sm text-black/60 dark:text-white/60">Rewards upto ₹9K</p>
                            </div>
                            <div className="p-3 md:p-4 bg-white dark:bg-[#141414] rounded-xl">
                                <h4 className="font-bold text-lg md:text-xl mb-1 text-black dark:text-white">Networking</h4>
                                <p className="text-xs md:text-sm text-black/60 dark:text-white/60">Global community</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative bg-white dark:bg-[#141414] p-6 md:p-8 rounded-3xl border dark:border-2 border-gray-100 dark:border-[#202020]">
                            <h3 className="text-xl md:text-2xl font-bold mb-4">Why Participate?</h3>
                            <ul className="space-y-3 md:space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold mt-1">1</div>
                                    <p className="ml-3 md:ml-4 text-sm md:text-base text-black/60 dark:text-white/60">Get hands-on experience with Gemini, Firebase, and Google Cloud.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold mt-1">2</div>
                                    <p className="ml-3 md:ml-4 text-sm md:text-base text-black/60 dark:text-white/60">Build a portfolio-worthy project in just one weekend.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold mt-1">3</div>
                                    <p className="ml-3 md:ml-4 text-sm md:text-base text-black/60 dark:text-white/60">Receive feedback from industry professionals.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold mt-1">4</div>
                                    <p className="ml-3 md:ml-4 text-sm md:text-base text-black/60 dark:text-white/60">Fun, food, and swag for all participants!</p>
                                </li>
                            </ul>
                        </div>
                        <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="h-48 md:h-64 w-full object-cover rounded-2xl border-2 border-black dark:border-[#202020] mt-6 md:mt-8" />
                    </div>
                </div>
            </div>
        </section>
    );
}
