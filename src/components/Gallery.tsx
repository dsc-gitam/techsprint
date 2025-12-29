export default function Gallery() {
  return (
    <div className="photos_grid">
      <img
        crossOrigin="anonymous"
        className="grid_item object-top"
        data-src="/highlights/1.JPG"
        src="/highlights/1.JPG"
        alt="Web Study Jams at GITAM University"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/2.jpg"
        src="/highlights/2.jpg"
        alt="Hacktober Fest at GVP"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/3.jpg"
        src="/highlights/3.jpg"
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
        data-src="/highlights/4.jpg"
        src="/highlights/4.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/5.jpg"
        src="/highlights/5.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/7.jpg"
        src="/highlights/7.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/6.jpg"
        src="/highlights/6.jpg"
      />
      <img
        crossOrigin="anonymous"
        className="grid_item"
        data-src="/highlights/8.jpg"
        src="/highlights/8.jpg"
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