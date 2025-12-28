const CodeOfConduct = () => {
  const cocData = [
    {
      name: "Be nice to the other attendees",
      des: "We're all part of the same community, so be friendly, welcoming, and generally a nice person. Be someone that other people want to be around. ",
    },
    {
      name: "Be respectful and constructive",
      des: "Remember to be respectful and constructive with your communication in discussions to fellow attendees. Don't get into flame wars, make personal attacks, vent, or rant unconstructively. Everyone should take responsibility for the community and take the initiative to diffuse tension and stop a negative thread as early as possible.",
    },
    {
      name: "Be collaborative",
      des: "We are here to learn a lot from each other. Share knowledge, and help each other out. You may disagree with ideas, not people.",
    },
    {
      name: "Participate",
      des: "Be a good listener. Be mentally present in the sessions you are interested in. Join in on discussions, show up for the sessions on time, offer feedback on your event experience, and help us get better in our community engagements.",
    },
    {
      name: "Basic etiquette for online discussions",
      des: "Keep off topic conversations to a minimum. Don’t be spammy by advertising or promoting personal projects which are off topic.",
    },
  ];

  return (
    <main className="p-16 min-h-screen bg-(--background)">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white/70">Code of Conduct</h1>
        <p className="text-lg text-gray-600 mt-2 mb-10  dark:text-white/40 max-w-[40ch]">
          All participants of TechSprint 2026 event, attendees, event staff, and
          speakers, must abide by the following policy:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cocData.map((item, index) => (
            <div
              key={index}
              className="p-8 border border-gray-200 dark:border-white/10 rounded-lg shadow-md bg-white dark:bg-[#121212]"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/80">
                {item.name}
              </h2>
              <p className="text-gray-600 dark:text-white/50 mt-2">{item.des}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CodeOfConduct;
