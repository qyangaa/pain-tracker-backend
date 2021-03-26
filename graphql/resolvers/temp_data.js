exports.screenState = {
  pages: [
    {
      type: "pain",
      screenType: "button",
      hasTime: false,
      title: "Today I am",
      backgroundImage: "/assets/Pictures/img-building.jpg",
      options: [
        { id: "better", text: "better" },
        { id: "worse", text: "worse" },
      ],
    },
    {
      type: "mood",
      screenType: "icon",
      title: "Today I feel",
      hasTime: false,
      backgroundImage: "/assets/Pictures/girl-865304.jpg",
      options: [
        {
          src: "/assets/Icons/peaceful.svg",
          id: "peaceful",
          text: "peaceful",
        },
        {
          src: "/assets/Icons/sad.svg",
          id: "sad",
          text: "sad",
        },
        {
          src: "/assets/Icons/happy.svg",
          id: "happy",
          text: "happy",
        },
        {
          src: "/assets/Icons/anxious.svg",
          id: "anxious",
          text: "anxious",
        },
      ],
    },
    {
      type: "exercise",
      screenType: "icon",
      title: "Today I did",
      hasTime: true,
      backgroundImage: "/assets/Pictures/sport.jpg",
      options: [
        {
          src: "/assets/Icons/hiking.svg",
          id: "hiking",
          text: "hiking",
        },
        {
          src: "/assets/Icons/weight.svg",
          id: "weight",
          text: "weight",
        },
        {
          src: "/assets/Icons/yoga.svg",
          id: "yoga",
          text: "yoga",
        },
        {
          src: "/assets/Icons/swimming.svg",
          id: "swimming",
          text: "swimming",
        },
      ],
    },
  ],
};
