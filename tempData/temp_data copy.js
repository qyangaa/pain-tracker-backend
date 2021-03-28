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
  {
    _id: { "$oid":  "605f8ef0534c1c502887b1cc"},
    "categoryId": { "$oid": "605f8d76b73a99d6e1ee02a1" },
    "text": "better",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8d76b73a99d6e1ee02a1" },
    "text": "worse",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8e3fb73a99d6e1ee02a2" },
    "src": "/assets/Icons/peaceful.svg",
    "text": "peaceful",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8e3fb73a99d6e1ee02a2" },
    "src": "/assets/Icons/sad.svg",
    "text": "sad",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8e3fb73a99d6e1ee02a2" },
    "src": "/assets/Icons/happy.svg",
    "text": "happy",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8e3fb73a99d6e1ee02a2" },
    "src": "/assets/Icons/anxious.svg",
    "text": "anxious",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8e49b73a99d6e1ee02a3" },
    "src": "/assets/Icons/hiking.svg",
    "text": "hiking",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8e49b73a99d6e1ee02a3" },
    "src": "/assets/Icons/weight.svg",
    "text": "weight",
  },
  {
    _id: { "$oid":  },
    "categoryId": { "$oid": "605f8e49b73a99d6e1ee02a3" },
    "src": "/assets/Icons/yoga.svg",
    "text": "yoga",
  },
  {
    _id: { "$oid":  },
    "categoryId": "605f8e49b73a99d6e1ee02a3",
    "src": "/assets/Icons/swimming.svg",
    "text": "swimming",
  },
];

exports.lastUsed = { user1: [{"$oid": "605f8ef0534c1c502887b1cc"}, {"$oid": "605f8f32534c1c502887b1cd"}, {"$oid": "605f8fd9534c1c502887b1d0"}, {"$oid": "605f8fe5534c1c502887b1d1"}] };

exports.suggested = [{"$oid": "605f8ef0534c1c502887b1cc"}, {"$oid": "605f8f32534c1c502887b1cd"}, {"$oid": "605f8fd9534c1c502887b1d0"}, {"$oid": "605f8fc8534c1c502887b1cf"}, {"$oid": "605f9001534c1c502887b1d4"}, {"$oid": "605f8fef534c1c502887b1d2"}];


{
  "lastUsed": [
    {
      "name": "pain",
      "_id": "605f8d76b73a99d6e1ee02a1",
      "title": "Today I am",
      "backgroundImage": "/assets/Pictures/img-building.jpg",
      "options": [
        {
          "text": "better",
          "_id": "605f8ef0534c1c502887b1cc",
          "src": null,
          "selected": false
        },
        {
          "text": "worse",
          "_id": "605f8f32534c1c502887b1cd",
          "src": null,
          "selected": false
        }
      ]
    },
    {
      "name": "mood",
      "_id": "605f8e3fb73a99d6e1ee02a2",
      "title": "Today I feel",
      "backgroundImage": "/assets/Pictures/girl-865304.jpg",
      "options": [
        {
          "text": "happy",
          "_id": "605f8fd9534c1c502887b1d0",
          "src": "/assets/Icons/happy.svg",
          "selected": false
        },
        {
          "text": "anxious",
          "_id": "605f8fe5534c1c502887b1d1",
          "src": "/assets/Icons/anxious.svg",
          "selected": false
        }
      ]
    }
  ]
}