export default function Hero() {
    return (
        <section className="relative min-h-[60vh] sm:min-h-[calc(100vh-64px)] py-8 sm:py-16 flex items-center justify-center overflow-hidden bg-white">
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                {/* Date Badge */}
                <div className="mb-6 sm:mb-8 inline-block">
                    <span className="px-4 sm:px-5 py-2 rounded-full bg-[#4285F4] text-white text-xs sm:text-sm font-semibold shadow-lg">
                        January 3<sup>rd</sup>-4<sup>th</sup>, 2026
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-[#202124] leading-tight">
                    Build the Future
                    <br />at{' '}
                    <span className="relative inline-block">
                        TechSprint
                        <span
                            className="absolute left-0 bottom-0 w-full h-1 sm:h-1.5 rounded-full"
                            style={{ background: 'linear-gradient(90deg, #4285F4 0%, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC04 50%, #FBBC04 75%, #34A853 75%, #34A853 100%)' }}
                        ></span>
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-lg sm:text-xl md:text-2xl text-[#5f6368] max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                    Join us for a <strong className="text-[#202124]">48-hour innovation marathon</strong>. Create, collaborate, and compete with the best minds using Google&apos;s latest technologies.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    <a href="/dashboard" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#4285F4] text-white rounded-full text-base sm:text-lg font-semibold hover:bg-[#3367D6] hover:shadow-xl transition-all duration-300">
                        Register Now
                    </a>
                    <a href="#about" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[#202124] border-2 border-[#dadce0] rounded-full text-base sm:text-lg font-semibold hover:border-[#202124] hover:bg-[#f8f9fa] transition-all">
                        Learn More
                    </a>
                </div>
            </div>

            {/* Background Images - Visible on all sizes */}
            <img src="https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2025/05/google_io_personalized_context.jpg" className="absolute top-10 right-4 sm:right-20 blur-[0.8px] w-24 sm:w-48 h-16 sm:h-32 object-cover rounded-xl opacity-30 sm:opacity-40" alt="" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="hidden sm:block absolute bottom-42 right-72 blur-lg w-28 h-18 object-cover rounded-xl opacity-30" alt="" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/210518_1004_3S1A4903_B_1_1.width-1300.jpg" className="absolute top-20 sm:top-24 left-4 sm:left-56 blur-sm w-20 sm:w-36 h-14 sm:h-24 object-cover rounded-xl opacity-30 sm:opacity-40" alt="" />
            <img src="https://www.hindustantimes.com/ht-img/img/2024/05/15/1600x900/Google-AI-Showcase-18_1715737614992_1715737643291.jpg" className="hidden sm:block -scale-x-100 absolute bottom-10 left-12 w-72 h-48 object-cover rounded-xl opacity-50" alt="" />
        </section>
    );
}
