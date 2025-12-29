export default function Links() {
  return (
    <div className="social_footer">
      <div className="social_body">
        <p>Keep in touch with GDG on Campus GITAM for the latest announcements</p>
        <div className="flex gap-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/gdgoncampusgitam/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GDG on Campus GITAM Instagram</title>
              <circle fill="#00B698" cx="20" cy="20" r="20"></circle>
              <path fill="#fff" d="M20,12.5c2.43,0,2.72.01,3.68.05.89.04,1.37.19,1.69.31.42.16.73.36,1.05.68.32.32.52.62.68,1.05.13.32.27.8.31,1.69.05.96.05,1.25.05,3.68s0,2.72-.05,3.68c-.04.89-.19,1.37-.31,1.69-.16.42-.36.73-.68,1.05-.32.32-.62.52-1.05.68-.32.13-.8.27-1.69.31-.96.05-1.25.05-3.68.05s-2.72,0-3.68-.05c-.89-.04-1.37-.19-1.69-.31-.42-.16-.73-.36-1.05-.68-.32-.32-.52-.62-.68-1.05-.13-.32-.27-.8-.31-1.69-.05-.96-.05-1.25-.05-3.68s0-2.72.05-3.68c.04-.89.19-1.37.31-1.69.16-.42.36-.73.68-1.05.32-.32.62-.52,1.05-.68.32-.13.8-.27,1.69-.31.96-.05,1.25-.05,3.68-.05m0-1.67c-2.47,0-2.78.01-3.75.05-1,.05-1.69.21-2.29.44-.62.24-1.15.56-1.67,1.08-.52.52-.84,1.05-1.08,1.67-.23.6-.4,1.28-.44,2.29-.05.97-.05,1.28-.05,3.75s0,2.78.05,3.75c.05,1,.21,1.69.44,2.29.24.62.56,1.15,1.08,1.67.52.52,1.05.84,1.67,1.08.6.23,1.28.4,2.29.44.97.05,1.28.05,3.75.05s2.78,0,3.75-.05c1-.05,1.69-.21,2.29-.44.62-.24,1.15-.56,1.67-1.08.52-.52.84-1.05,1.08-1.67.23-.6.4-1.28.44-2.29.05-.97.05-1.28.05-3.75s0-2.78-.05-3.75c-.05-1-.21-1.69-.44-2.29-.24-.62-.56-1.15-1.08-1.67-.52-.52-1.05-.84-1.67-1.08-.6-.23-1.28-.4-2.29-.44-.97-.05-1.28-.05-3.75-.05Z" />
              <path fill="#fff" d="M20,15.5c-2.49,0-4.5,2.01-4.5,4.5s2.01,4.5,4.5,4.5,4.5-2.01,4.5-4.5-2.01-4.5-4.5-4.5Zm0,7.42c-1.61,0-2.92-1.31-2.92-2.92s1.31-2.92,2.92-2.92,2.92,1.31,2.92,2.92-1.31,2.92-2.92,2.92Z" />
              <circle fill="#fff" cx="24.69" cy="15.31" r="1.05" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://in.linkedin.com/company/gdsc-gitam-vizag"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GDG on Campus GITAM LinkedIn</title>
              <circle fill="#00B698" cx="20" cy="20" r="20"></circle>
              <g fill="#fff" transform="translate(10, 10)">
                <path d="M4.447,20H.328V6.647H4.447ZM2.385,4.828A2.4,2.4,0,1,1,4.77,2.41,2.41,2.41,0,0,1,2.385,4.828ZM20,20H15.889V13.5c0-1.548-.031-3.536-2.155-3.536-2.155,0-2.486,1.684-2.486,3.424V20H7.133V6.647h3.951V8.466h.058a4.329,4.329,0,0,1,3.9-2.142c4.17,0,4.937,2.746,4.937,6.313V20Z" />
              </g>
            </svg>
          </a>
        </div>
      </div>
      <div className="social_gif">
        <img
          className="md:social_gif opacity-60"
          crossOrigin="anonymous"
          alt="GDG on Campus GITAM"
          src="/gdsc_sc.webp"
        />
      </div>
    </div>
  );
}
