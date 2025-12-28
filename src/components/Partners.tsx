export default function Partners() {
  return (
    <div className="px-[20px] md:px-[60px] py-[20px] md:py-12 max-w-[1400px] mx-auto text-center">
      <h3 className="my-7 p-0 text-[28px] md:text-[32px] leading-[30px]">
        Partners
      </h3>
      <h4 className="opacity-50 mb-3 mt-[26.6px] text-xl">Community Partner</h4>
      <div className="flex gap-x-16 justify-center">
        <div className="w-[220px] h-[140px] flex items-center justify-center">
          <img
            src="https://miro.medium.com/v2/resize:fit:1200/1*4YZ4tOc5oRs_Ksx-R_WFMw.png"
            className="max-w-full max-h-full object-contain"
            alt="Google Developer Groups | Vizag"
          />
        </div>
      </div>

      {/* All Partners in one row - including sponsors */}
      <div className="flex flex-wrap gap-8 md:gap-12 justify-center items-end mx-auto mt-4">
        {/* Venue Partner - GITAM */}
        <div className="w-max">
          <h4 className="opacity-50 mt-[26.6px] text-xl">Venue Partner</h4>
          <div className="w-[220px] h-[140px] flex items-center justify-center">
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
        <div className="w-max">
          <h4 className="opacity-50 mt-[26.6px] text-xl">Tech Partner</h4>
          <div className="w-[220px] h-[140px] flex items-center justify-center">
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
        <div className="w-max">
          <h4 className="opacity-50 mt-[26.6px] text-xl">Partner</h4>
          <div className="w-[220px] h-[140px] flex items-center justify-center">
            <img
              src="/partners/student_life_logo.jpg"
              className="max-w-full max-h-full object-contain rounded-lg"
              alt="Student Life"
            />
          </div>
        </div>

        {/* Partner - GCGC */}
        <div className="w-max">
          <h4 className="opacity-50 mt-[26.6px] text-xl">Partner</h4>
          <div className="w-[220px] h-[140px] flex items-center justify-center">
            <img
              src="/partners/gcgc_logo.png"
              className="max-w-full max-h-full object-contain"
              alt="GCGC"
            />
          </div>
        </div>

        {/* VDC - Sponsor */}
        <div className="w-max">
          <h4 className="opacity-50 mt-[26.6px] text-xl">Sponsor</h4>
          <div className="w-[220px] h-[140px] flex items-center justify-center">
            <img
              src="/partners/VDC_Logo.png"
              className="max-w-full max-h-full object-contain"
              alt="VDC - Vizag Developer Community"
            />
          </div>
        </div>

        {/* CSE - Sponsor */}
        <div className="w-max">
          <h4 className="opacity-50 mt-[26.6px] text-xl">Sponsor</h4>
          <div className="w-[220px] h-[140px] flex items-center justify-center">
            <img
              src="/partners/CSE_Logo.png"
              className="max-w-full max-h-full object-contain"
              alt="GITAM CSE"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
