import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Timeline from '@/components/Timeline';
import Marquee from 'react-fast-marquee';

export default function Home() {
    return (
        <main className="min-h-screen bg-(--background)">
            <Navbar />
            <Hero />
            <About />
            <div className='py-8'>
                <Marquee>
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://storage.googleapis.com/cms-storage-bucket/lockup_flutter_horizontal.c823e53b3a1a7b0d36a9.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Android_logo_2023.svg/2560px-Android_logo_2023.svg.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/New_Firebase_logo.svg/1200px-New_Firebase_logo.svg.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://preview.redd.it/googles-ai-chatbot-gemini-implemented-a-new-logo-to-match-v0-w4qp6kkvugef1.jpeg?width=1080&crop=smart&auto=webp&s=2d6b9e5a86172ab6011484abc8a3c827e35f76fc" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://pbs.twimg.com/profile_images/1924895422327463936/V991NnhE_400x400.jpg" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1024px-Google_Cloud_logo.svg.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://play-lh.googleusercontent.com/dWGgMuaN9WwN3Ihha4QMzOI4RtpfrpMhP0jSeqDm5DKnFcv74HvA33Rna4tTKZ8Ifk2E" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/google-antigravity-logo-icon.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/2048px-Google_Chrome_icon_%28February_2022%29.svg.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://www.tensorflow.org/images/tf_logo_horizontal.png" />
                    <img className='h-8 w-auto saturate-0 opacity-40 mx-8 object-contain' src="https://upload.wikimedia.org/wikipedia/commons/6/67/Kubernetes_logo.svg" />
                </Marquee>
            </div>
            <Timeline />

            <footer className="bg-(--io-dark) text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 Google TechSprint. All rights reserved.</p>
                    <div className="mt-4 flex justify-center space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-white">Code of Conduct</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
