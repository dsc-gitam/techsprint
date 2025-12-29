export default function Gallery() {
  // Cloudinary base with auto-format, auto-quality, and responsive sizing
  const cloudinaryBase = "https://res.cloudinary.com/dlhw4q5rh/image/upload/f_auto,q_auto,w_800";

  return (
    <div className="photos_grid">
      <img
        crossOrigin="anonymous"
        className="grid_item object-top"
        src={`${cloudinaryBase}/v1767012101/1_gt8bkr.jpg`}
        alt="Web Study Jams at GITAM University"
        loading="lazy"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        src={`${cloudinaryBase}/v1767012097/2_vl0eyx.jpg`}
        alt="Hacktober Fest at GVP"
        loading="lazy"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        src={`${cloudinaryBase}/v1767012099/3_xogicy.jpg`}
        alt="GDGoC GITAM Event"
        loading="lazy"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        src={`${cloudinaryBase}/v1767012098/4_ofokmf.jpg`}
        alt="GDGoC GITAM Workshop"
        loading="lazy"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        src={`${cloudinaryBase}/v1767012099/5_ozbxvl.jpg`}
        alt="GDGoC GITAM Session"
        loading="lazy"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        src={`${cloudinaryBase}/v1767012101/7_m9dqxk.jpg`}
        alt="GDGoC GITAM Hackathon"
        loading="lazy"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        src={`${cloudinaryBase}/v1767012098/6_vrpc7j.jpg`}
        alt="GDGoC GITAM Community"
        loading="lazy"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        src={`${cloudinaryBase}/v1767012100/8_zxs8dz.jpg`}
        alt="Cloud Study Jams participants wearing their swags at MVGR"
        loading="lazy"
      />
      <div className="gallery_info p-4 md:p-8!">
        <div>
          <h2 className="text-2xl md:text-4xl! text-white!">GDGoC GITAM's<br />highlights</h2>

          <p className="text-white/70! text-sm md:text-base mt-2 md:mt-4">
            Past year's built lots of excitement. Check out photos from featured
            talks, hands-on learning sessions, and after-hours fun.
          </p>
        </div>
      </div>
    </div>
  );
}