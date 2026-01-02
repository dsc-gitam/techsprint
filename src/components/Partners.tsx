export default function Partners() {
  return (
    <div className="px-4 md:px-[60px] py-[20px] md:py-12 max-w-[1400px] mx-auto text-center overflow-hidden">
      <h3 className="my-7 p-0 text-[28px] md:text-[32px] leading-[30px]">
        Partners
      </h3>
      <h4 className="opacity-50 mb-3 mt-[26.6px] text-lg md:text-xl">Community Partner</h4>
      <div className="flex gap-x-8 md:gap-x-16 justify-center">
        <div className="w-[180px] md:w-[220px] h-[120px] md:h-[140px] flex items-center justify-center">
          <img
            src="https://miro.medium.com/v2/resize:fit:1200/1*4YZ4tOc5oRs_Ksx-R_WFMw.png"
            className="max-w-full max-h-full object-contain"
            alt="Google Developer Groups | Vizag"
          />
        </div>
      </div>

      {/* All Partners - 2 columns on mobile, flex on desktop */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-6 md:gap-12 justify-center items-end mx-auto mt-4">
        {/* Venue Partner - GITAM */}
        <div className="flex flex-col items-center">
          <h4 className="opacity-50 mt-4 md:mt-[26.6px] text-sm md:text-xl">Venue Partner</h4>
          <div className="w-[140px] md:w-[220px] h-[90px] md:h-[140px] flex items-center justify-center">
            <a href="https://gitam.edu" className="contents">
              <img
                src="/partners/gitam-logo-black.png"
                className="max-w-full max-h-full object-contain dark:hidden"
                alt="GITAM"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/d/da/GITAM_logo.svg/1200px-GITAM_logo.svg.png"
                className="max-w-full max-h-full object-contain hidden dark:block"
                alt="GITAM"
              />
            </a>
          </div>
        </div>

        {/* Tech Partner - Ananta */}
        <div className="flex flex-col items-center">
          <h4 className="opacity-50 mt-4 md:mt-[26.6px] text-sm md:text-xl">Tech Partner</h4>
          <div className="w-[140px] md:w-[220px] h-[90px] md:h-[140px] flex items-center justify-center">
            <a href="https://theananta.in" className="contents">
              <img
                src="/partners/ananta-logo-black.png"
                className="max-w-full max-h-full object-contain dark:hidden"
                alt="The Ananta Studio™️"
              />
              <img
                src="/partners/the_ananta_logo_white.svg"
                className="max-w-full max-h-full object-contain hidden dark:block"
                alt="The Ananta Studio™️"
              />
            </a>
          </div>
        </div>

        {/* Partner - Student Life */}
        <div className="flex flex-col items-center">
          <h4 className="opacity-50 mt-4 md:mt-[26.6px] text-sm md:text-xl">Partner</h4>
          <div className="w-[140px] md:w-[220px] h-[90px] md:h-[140px] flex items-center justify-center">
            <img
              src="/partners/student_life_logo.jpg"
              className="max-w-full max-h-full object-contain rounded-lg"
              alt="Student Life"
            />
          </div>
        </div>

        {/* GCGC - Sponsor */}
        <div className="flex flex-col items-center">
          <h4 className="opacity-50 mt-4 md:mt-[26.6px] text-sm md:text-xl">Sponsor</h4>
          <div className="w-[140px] md:w-[220px] h-[90px] md:h-[140px] flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dlhw4q5rh/image/upload/f_auto,q_auto,w_400/v1767012299/gcgc_logo_efnugd.png"
              className="max-w-full max-h-full object-contain"
              alt="GCGC"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="opacity-50 mt-4 md:mt-[26.6px] text-sm md:text-xl">Sponsor</h4>
          <div className="w-[140px] md:w-[220px] h-[90px] md:h-[140px] flex items-center justify-center">
            <img
              src="./partners/farmvaidya.jpeg"
              className="max-w-full max-h-full object-contain"
              alt="GCGC"
            />
          </div>
        </div>

        {/* VDC - Sponsor */}
        <div className="flex flex-col items-center">
          <h4 className="opacity-50 mt-4 md:mt-[26.6px] text-sm md:text-xl">Sponsor</h4>
          <div className="w-[140px] md:w-[220px] h-[90px] md:h-[140px] flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dlhw4q5rh/image/upload/f_auto,q_auto,w_400/v1767012298/VDC_Logo_petfvc.png"
              className="max-w-full max-h-full object-contain"
              alt="VDC - Vizag Developer Community"
            />
          </div>
        </div>

        {/* CSE - Partner */}
        <div className="flex flex-col items-center">
          <h4 className="opacity-50 mt-4 md:mt-[26.6px] text-sm md:text-xl">Partner</h4>
          <div className="w-[140px] md:w-[220px] h-[90px] md:h-[140px] flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dlhw4q5rh/image/upload/f_auto,q_auto,w_400/v1767012298/CSE_Logo_pu283y.png"
              className="max-w-full max-h-full object-contain"
              alt="GITAM CSE"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
