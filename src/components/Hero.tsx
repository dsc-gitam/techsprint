export default function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-80px)] pb-[36px] flex items-center justify-center overflow-hidden bg-white">

            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="mb-8 inline-block">
                    <span className="px-5 py-2 rounded-full bg-[#4285F4] text-white text-sm font-semibold shadow-lg">
                        January 3<sup>rd</sup>-4<sup>th</sup>, 2026
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-[#202124]">
                    Build the Future
                    <br />at <span style={{
                        background: 'linear-gradient(90deg, #4285F4 0%, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC04 50%, #FBBC04 75%, #34A853 75%, #34A853 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>TechSprint</span>
                </h1>

                <p className="mt-4 text-xl md:text-2xl text-[#5f6368] max-w-3xl mx-auto mb-10 leading-relaxed">
                    Join us for a <strong className="text-[#202124]">48-hour innovation marathon</strong>. Create, collaborate, and compete with the best minds using Google&apos;s latest technologies.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="/dashboard" className="px-8 py-4 bg-[#4285F4] text-white rounded-full text-lg font-semibold hover:bg-[#3367D6] hover:shadow-xl transition-all duration-300">
                        Register Now
                    </a>
                    <a href="#about" className="px-8 py-4 bg-white text-[#202124] border-2 border-[#dadce0] rounded-full text-lg font-semibold hover:border-[#202124] hover:bg-[#f8f9fa] transition-all">
                        Learn More
                    </a>
                </div>

            </div>
            <img src="https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2025/05/google_io_personalized_context.jpg" className="absolute top-10 right-20 blur-[0.8px] w-48 h-32 object-cover rounded-xl opacity-40" alt="" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="absolute bottom-42 right-72 blur-lg w-28 h-18 object-cover rounded-xl opacity-30" alt="" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/210518_1004_3S1A4903_B_1_1.width-1300.jpg" className="absolute top-24 left-56 blur-sm w-36 h-24 object-cover rounded-xl opacity-40" alt="" />
            <img src="https://www.hindustantimes.com/ht-img/img/2024/05/15/1600x900/Google-AI-Showcase-18_1715737614992_1715737643291.jpg" className="-scale-x-100 absolute bottom-10 left-12 w-72 h-48 object-cover rounded-xl opacity-50" alt="" />
        </section>
    );
}
