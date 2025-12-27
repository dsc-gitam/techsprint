export default function Gallery() {
  return (
    <div className="photos_grid">
      <img
        crossOrigin="anonymous"
        className="grid_item object-top"
        data-src="/highlights/IWD-2023-1.jpg"
        src="/highlights/IWD-2023-1.jpg"
        alt="Web Study Jams at GITAM University"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="highlights/IWD-2023-2.jpg"
        src="highlights/IWD-2023-2.jpg"
        alt="Hacktober Fest at GVP"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/IWD-2023-3.jpg"
        src="/highlights/IWD-2023-3.jpg"
      />
      {/* <img
        crossOrigin="anonymous"
        className="grid_item object-right"
        data-src="/highlights/gdsc_iwd_2.png"
        src="/highlights/gdsc_iwd_2.png"
      /> */}
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/IWD-2023-4.jpg"
        src="/highlights/IWD-2023-4.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/IWD-2023-5.jpg"
        src="/highlights/IWD-2023-5.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/IWD-2023-7.jpg"
        src="/highlights/IWD-2023-7.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/IWD-2023-6.jpg"
        src="/highlights/IWD-2023-6.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="highlights/IWD-2023-9.jpg"
        src="highlights/IWD-2023-9.jpg"
        alt="Cloud Study Jams participants wearing their swags at MVGR"
      />
      <div className="gallery_info p-8!">
        <div>
          <h2 className="text-4xl! text-white!">GDGoC GITAM's<br />highlights</h2>

          <p className="text-white/70! w-[28ch] mt-4">
            Past year's built lots of excitement. Check out photos from featured
            talks, hands-on learning sessions, and after-hours fun.
          </p>
        </div>
        {/* <a
          href="https://photos.app.goo.gl/9HPAL3Tkv3vKmYrh7"
          target="_blank"
          rel="noopener noreferrer"
        >
          See all photos
        </a> */}
      </div>
    </div>
  );
}
