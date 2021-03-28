exports.categories = [
  {
    _id: "pain",
    name: "pain",
    screenType: "button",
    hasDuration: false,
    title: "Today I am",
    backgroundImage: "/assets/Pictures/img-building.jpg",
  },
  {
    _id: "mood",
    name: "mood",
    screenType: "icon",
    title: "Today I feel",
    hasDuration: false,
    backgroundImage: "/assets/Pictures/girl-865304.jpg",
  },
  {
    _id: "exercise",
    name: "exercise",
    screenType: "icon",
    title: "Today I did",
    hasDuration: true,
    backgroundImage: "/assets/Pictures/sport.jpg",
  },
];

exports.options = [
  { _id: "better", categoryId: "pain", text: "better" },
  { _id: "worse", categoryId: "pain", text: "worse" },
  {
    _id: "peaceful",
    categoryId: "mood",
    src: "/assets/Icons/peaceful.svg",
    text: "peaceful",
  },
  {
    _id: "sad",
    categoryId: "mood",
    src: "/assets/Icons/sad.svg",
    text: "sad",
  },
  {
    _id: "happy",
    categoryId: "mood",
    src: "/assets/Icons/happy.svg",
    text: "happy",
  },
  {
    _id: "anxious",
    categoryId: "mood",
    src: "/assets/Icons/anxious.svg",
    text: "anxious",
  },
  {
    _id: "hiking",
    categoryId: "exercise",
    src: "/assets/Icons/hiking.svg",
    text: "hiking",
  },
  {
    _id: "weight",
    categoryId: "exercise",
    src: "/assets/Icons/weight.svg",
    text: "weight",
  },
  {
    _id: "yoga",
    categoryId: "exercise",
    src: "/assets/Icons/yoga.svg",
    text: "yoga",
  },
  {
    _id: "swimming",
    categoryId: "exercise",
    src: "/assets/Icons/swimming.svg",
    text: "swimming",
  },
];

exports.lastUsed = { user1: ["better", "worse", "happy", "anxious"] };

exports.suggested = [
  "605f8ef0534c1c502887b1cc",
  "605f8f32534c1c502887b1cd",
  "605f8fd9534c1c502887b1d0",
  "605f8fc8534c1c502887b1cf",
  "605f9001534c1c502887b1d4",
  "605f8fef534c1c502887b1d2",
];
