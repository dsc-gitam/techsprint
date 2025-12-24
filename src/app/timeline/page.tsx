import Navbar from '@/components/Navbar';
import Timeline from '@/components/Timeline';

export default function TimelinePage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-4">
                <Timeline />
            </div>

            <footer className="bg-white border-t border-[#e8eaed] py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <svg className='w-8 h-6' width="504" height="504" viewBox="0 0 504 504" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="TechSprint Logo" role="img">
                                <path d="M444.659 220.504C467.171 207.749 493.228 219.295 498.604 243.651L498.727 244.229C501.671 258.54 495.24 273.965 482.448 281.42C434.774 309.203 387.042 336.867 339.078 364.106C325.898 371.59 312.542 370.305 300.344 360.99L300.343 360.989C294.111 356.233 290.164 350.706 288.079 344.589C286.001 338.497 285.683 331.551 287.135 323.809C290.43 312.527 297.845 304.843 308.548 298.869L308.547 298.868C327.591 288.24 346.371 277.027 365.128 266.138L365.127 266.137C388.346 252.802 411.466 239.398 434.694 226.166L444.659 220.504Z" fill="#FABC05" stroke="black" strokeWidth="9" />
                                <path d="M298.806 142.521C309.727 132.819 326.301 130.674 339.154 138.025C387.052 165.421 434.876 192.927 482.447 220.845C495.313 228.396 500.905 240.347 499.203 255.239L499.117 255.95C498.113 263.724 495.3 269.906 491.045 274.77C486.808 279.615 480.953 283.362 473.523 285.976C462.103 288.765 451.742 286.187 441.216 279.904C422.488 268.726 403.387 258.067 384.578 247.268C358.11 231.91 331.631 216.703 305.294 201.212C282.991 188.092 279.964 159.754 298.368 142.917L298.806 142.521Z" fill="#109D58" stroke="black" strokeWidth="9" />
                                <path d="M164.575 138.442C177.595 131.028 190.823 131.922 202.919 140.826C209.388 145.589 213.525 151.19 215.743 157.428C217.923 163.558 218.34 170.569 216.967 178.397C216.04 180.449 215.12 182.948 214.453 184.522C213.59 186.56 212.785 188.049 211.813 189.128C207.135 194.32 201.968 199.119 196.353 202.583C177.503 214.206 158.277 225.119 139.038 236.398C122.071 246.038 105.081 255.668 88.1221 265.343C79.3282 270.359 70.8526 275.391 62.1885 280.3L58.4619 282.396C40.5079 292.417 19.363 286.57 9.21191 268.969H9.21094C-0.422102 252.268 5.09845 230.576 22.3037 220.532C69.5919 192.931 116.999 165.533 164.575 138.442Z" fill="#E94436" stroke="black" strokeWidth="9" />
                                <path d="M36.8911 215.636C39.0871 215.365 40.7791 215.318 42.1997 215.621C49.0358 217.077 55.7766 219.15 61.5825 222.281C81.0734 232.792 100.137 243.988 119.523 255.009H119.524C136.356 264.881 153.193 274.783 170.051 284.633V284.632C180.041 290.47 189.837 295.938 199.647 301.792V301.791C217.304 312.332 222.813 333.566 212.645 351.156V351.157C203.147 367.591 182.123 373.725 164.965 364.488L164.152 364.036L146.327 353.844C104.749 330.04 63.2664 306.073 21.9233 281.873C8.99308 274.304 3.15327 262.401 4.81689 247.474C5.70649 239.489 8.48863 233.105 12.7817 228.065C17.0004 223.113 22.8619 219.245 30.3276 216.52C32.5694 216.298 35.192 215.846 36.8911 215.636Z" fill="#4385F3" stroke="black" strokeWidth="9" />
                            </svg>
                            <span className="text-lg font-bold text-[#202124] flex items-end">
                                <span>TechS</span>
                                <span className="relative">
                                    p
                                    <span className='absolute top-[68%] left-[1px] w-[2px] h-5 bg-[#202124]'></span>
                                </span>
                                <span>rint</span>
                            </span>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="text-[#5f6368] hover:text-[#202124] transition-colors">Privacy Policy</a>
                            <a href="#" className="text-[#5f6368] hover:text-[#202124] transition-colors">Terms of Service</a>
                            <a href="#" className="text-[#5f6368] hover:text-[#202124] transition-colors">Code of Conduct</a>
                        </div>

                        {/* Copyright */}
                        <p className="text-sm text-[#5f6368]">© 2025 Google TechSprint</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
