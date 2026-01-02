"use client";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Timeline from '@/components/Timeline';
import Marquee from 'react-fast-marquee';
import dynamic from "next/dynamic";
import Gallery from '@/components/Gallery';
import Partners from '@/components/Partners';
import Links from '@/components/Links';
import VoiceAgent from '@/components/VoiceAgent';
import { Toaster } from 'sonner';
import './voice-agent.css';

const Countdown = dynamic(() => import("@/components/Countdown"), {
    ssr: false,
});

export default function Home() {
    return (
        <main className="min-h-screen bg-(--background)">
            {/* <Navbar /> */}
            <Hero />
            <div className='relative mt-10'>
                <img
                    src="/hackathon.jpg"
                    className="w-full saturate-0 opacity-50 h-[200px] md:h-[300px] object-cover"
                    alt="A picture from an event hosted by WTM Vizag"
                />
                <div className="bg-linear-to-l from-black to-transparent h-full absolute top-0 w-full pl-[60%] md:pl-[75%] pr-[5%] py-4 md:py-10 dark:saturate-0 mx-auto md:my-auto flex items-center">
                    <Countdown />
                </div>
            </div>
            <About />
            <div className='py-8 overflow-hidden bg-(--background)'>
                <Marquee>
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://storage.googleapis.com/cms-storage-bucket/lockup_flutter_horizontal.c823e53b3a1a7b0d36a9.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Android_logo_2023.svg/2560px-Android_logo_2023.svg.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/1200px-New_Firebase_logo.svg.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1024px-Google_Cloud_logo.svg.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/google-antigravity-logo-icon.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/2048px-Google_Chrome_icon_%28February_2022%29.svg.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://www.tensorflow.org/images/tf_logo_horizontal.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png" />
                    <img className='h-6 md:h-8 w-auto mx-4 md:mx-8 object-contain' src="/stitch.png" />
                </Marquee>
            </div>
            <Gallery />
            {/* <Timeline /> */}
            <Partners />
            {/* <Streams /> */}
            <img
                src="https://res.cloudinary.com/dlhw4q5rh/image/upload/f_auto,q_auto,w_1200/v1767012101/9_nrcnyw.jpg"
                className="w-full h-[400px] md:h-[700px] object-cover"
                alt="GDG on Campus GITAM event"
            />
            <Links />

            <footer className="bg-black/5 dark:bg-[#121212]/50 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-black/60 dark:text-white/60">© 2026 Google TechSprint. All rights reserved.</p>
                    <div className="mt-4 flex justify-center space-x-6">
                        <a href="#" className="text-black/40 dark:text-white/40 hover:text-black hover:dark:text-white">Privacy Policy</a>
                        <a href="#" className="text-black/40 dark:text-white/40 hover:text-black hover:dark:text-white">Terms of Service</a>
                        <a href="#" className="text-black/40 dark:text-white/40 hover:text-black hover:dark:text-white">Code of Conduct</a>
                    </div>
                </div>
            </footer>
            
            {/* Farm Vaidya Voice Agent */}
            <VoiceAgent />
            <Toaster />
        </main>
    );
}
