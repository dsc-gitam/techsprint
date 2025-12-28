"use client";
import "./styles.css";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    if (window.location.hash === "#terms-conditions") {
      const element = document.getElementById("terms-conditions");
      if (element) {
        element.scrollIntoView();
      }
    }
  }, []);
  return (
    <main className="bg-(--background)">

      <div className="p-[20px] md:p-[60px] faq">
        <div className="flex flex-col md:flex-row">
          <h2>General</h2>
          <div className="mt-6 md:mt-[unset]">
            <h3>Session Schedule</h3>
            <p>
              The schedule can be found <a href="/schedule">here</a> soon.
            </p>
            <br />
            <h3>Community Guidelines</h3>
            <p>
              {" "}
              Our community guidelines can be found{" "}
              <a href="/coc" target="_blank">
                here
              </a>
              . Be nice to each other, and be respectful and constructive.
            </p>
            <br />
            <h3>Date and location</h3>
            <p className="mb-4">
              Google TechSprint 2026 will take place on Day 1 & Day 2 at Vignan
              Institute of Information Technology, Visakhapatnam.
            </p>
            <p className="mb-4">
              To see a detailed schedule of events
              and activities, be sure to visit the TechSprint 2026 website, and
              follow us on social media for updates. You can also follow the
              conversation about
              TechSprint 2026 via official hashtags <b>#TechSprint2026</b>. In addition,
              we'll be emailing attendees with important information and updates
              leading up to the event.
            </p>
            <br />
            <h3>Content Formats</h3>
            <p>
              During the conference, attendees will be able to attend sessions and
              hands-on workshops, chat with experts and attendees.
            </p>
            <br />
            <h3>Language</h3>
            <p>All presentations at TechSprint 2026 Vizag will be in English.</p>
            <br />
          </div>
        </div>
        <br />
        <br />
        {/* <div className="flex flex-col md:flex-row">
        <h2>Amenities</h2>
        <div className="mt-6 md:mt-[unset]">
          <h3>Internet Access</h3>
          <p>
            Attendees can connect to the WiFi network{" "}
            <span className="text-[#D84315]">GITAM_5GHz</span> with password{" "}
            <b>Gitam$$123</b>
          </p>{" "}
          <h3>Washroom</h3>
          <p>
            Washrooms can be found on either side (East and West) of the ICT
            building, located behind the elevator lobbies.
          </p>
          <h3>Drinking Fountain</h3>
          <p>
            Drinking fountain/bottle filling stations can be found next to all
            washroom entrances.
          </p>
        </div>
      </div> */}
        <br />
        <br />
        <div className="flex flex-col md:flex-row">
          <h2>Registration</h2>
          <section id="terms-conditions" className="mt-6 md:mt-[unset]">
            <h3>Registration terms & conditions</h3>
            <ul className="list-disc ml-12">
              <li>
                Each individual may purchase only one ticket. You may not register
                on behalf of anyone else.
              </li>
              <li>
                By registering and accepting any discounts, gifts, or items of
                value related to TechSprint 2026 Vizag, you certify that you are able
                to do so in compliance with applicable laws and the internal rules
                of your organization.
              </li>
              <li>
                Tickets may not be sold, bartered, or auctioned in any way, and
                doing so may result in Techsprint Vizag rendering the ticket null and
                void without any responsibility to Techsprint Vizag.
              </li>
              <li>
                Attendees aren’t permitted to bring guests to TechSprint 2026 Vizag.
              </li>
              <li>
                If you have someone traveling with you, they’ll need to register
                themselves and purchase an attendee ticket.
              </li>
              <li>
                Photographs and/or video taken at TechSprint 2026 Vizag by Techsprint Vizag,
                or others on behalf of Techsprint Vizag, may include your image or
                likeness.
              </li>
              <li>
                You agree that Techsprint Vizag may use such photographs and/or video for
                any purpose without compensation to you.
              </li>
              <li>
                All information entered into the registration form must be correct
                and accurate to the best of your knowledge.
              </li>
              <li>
                All registered attendees agree to allow Techsprint Vizag to contact them
                regarding their registration and attendance at the event.
              </li>
              <li>
                By registering for a ticket, you agree to allow Techsprint Vizag to
                communicate with you via email with information regarding the
                event.
              </li>
              <li>
                You agree to be solely responsible for your own safety,
                belongings, and well-being while participating in TechSprint 2026
                Vizag.
              </li>
              <li>
                Techsprint Vizag won't be liable for your participation in TechSprint 2026
                Vizag.
              </li>
              <li>
                No solicitation or selling of items or services is allowed at TechSprint 2026 Vizag.
              </li>
              <li>
                Any attendee conducting these activities may be removed from the
                conference.
              </li>
              <li>
                In case of a draw, the team with{" "}
                <b>highest women participation</b> will be given the priority.
              </li>
            </ul>
          </section>
        </div>
        <br />
        <br />
        <div className="flex flex-col md:flex-row">
          <h2>Attendance Details</h2>
          <div className="mt-6 md:mt-[unset]">
            <h3>Event Attire</h3>
            <p>
              TechSprint 2026 Vizag is a developer event, so please be comfortable and
              casual. There is no enforced dress code.
            </p>
            <h3>Onsite food & beverages</h3>
            <p>
              Attendees are offered complimentary breakfast, lunch, dinner and tea
              break.
            </p>
            <h3>Smoking</h3>
            <p>Smoking is strictly prohibited in the venue.</p>
            <h3>No Soliciting</h3>
            <p>
              No solicitation or selling of items or services is allowed at TechSprint 2026 Vizag. Any attendee conducting these activities may be
              removed from the conference.
            </p>
            <h3>Community Guidelines</h3>
            <p>
              Check out the full Community Guidelines <a href="/coc">here</a>.
            </p>
          </div>
        </div>
      </div>

    </main>
  );
}
