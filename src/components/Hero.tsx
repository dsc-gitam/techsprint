export default function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-80px)] pb-[36px] flex items-center justify-center overflow-hidden">


            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="mb-8 inline-block">
                    <span className="px-4 py-1.5 rounded-full border border-(--io-border) bg-white/50 backdrop-blur-sm text-sm font-medium text-gray-600">
                        January 3<sup>rd</sup>-4<sup>th</sup>, 2026
                    </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6">
                    Build the Future
                    <br />at TechSprint
                </h1>

                <p className="mt-4 text-xl md:text-2xl text-black/80 max-w-3xl mx-auto mb-10">
                    Join us for a 48-hour innovation marathon. Create, collaborate, and compete with the best minds using Google's latest technologies.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="/dashboard" className="px-8 py-4 bg-[#2563eb] text-white rounded-full text-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-300">
                        Register Now
                    </a>
                    <a href="#about" className="px-8 py-4 bg-(--background) text-(--foreground) border border-[var(--io-border)] rounded-full text-lg font-medium hover:bg-gray-50 transition-all">
                        Learn More
                    </a>
                </div>

            </div>
            <img src="https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2025/05/google_io_personalized_context.jpg" className="absolute top-10 right-20 blur-[0.8px] w-48 h-32 object-cover rounded-xl" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PXL_20210518_000223011.max-1200x676.format-webp.webp" className="absolute bottom-42 right-72 blur-lg w-28 h-18 object-cover rounded-xl" />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/210518_1004_3S1A4903_B_1_1.width-1300.jpg" className="absolute top-24 left-56 blur-sm w-36 h-24 object-cover rounded-xl" />
            <img src="https://www.hindustantimes.com/ht-img/img/2024/05/15/1600x900/Google-AI-Showcase-18_1715737614992_1715737643291.jpg" className="-scale-x-100 absolute bottom-10 left-12 w-72 h-48 object-cover rounded-xl" />
        </section>
    );
}
