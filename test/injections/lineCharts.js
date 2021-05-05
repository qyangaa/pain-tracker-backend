exports.lineTypes = {
  PAIN_LEVEL: "pain level",
  EXERCISE_DURATION: "exercise duration",
  MOOD_LEVEL: "mood level",
};
exports.lineTypes_output = [
  { id: "PAIN_LEVEL", name: "pain level" },
  { id: "EXERCISE_DURATION", name: "exercise duration" },
  { id: "MOOD_LEVEL", name: "mood level" },
];

exports.dummyLineData = "dummy data";

exports.getAggregate = ({ args, req }) => {
  if (!args.categoryId || !args.categoryName || !req.uid) {
    throw new Error("missing argument");
  }
  return this.dummyLineData;
};

exports.getDailyTotal = ({ args, req }) => {
  if (!args.categoryId || !args.categoryName || !req.uid || !args.unit) {
    throw new Error("missing argument");
  }
  return this.dummyLineData;
};
