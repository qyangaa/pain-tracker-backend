const charts = require("../graphql/resolvers/charts");
const assert = require("assert");
const { argsToArgsConfig } = require("graphql/type/definition");

const lineTypes = {
  PAIN_LEVEL: "pain level",
  EXERCISE_DURATION: "exercise duration",
  MOOD_LEVEL: "mood level",
};
const lineTypes_output = [
  { id: "PAIN_LEVEL", name: "pain level" },
  { id: "EXERCISE_DURATION", name: "exercise duration" },
  { id: "MOOD_LEVEL", name: "mood level" },
];

describe("charts.js", () => {
  const req = { uid: 1 };
  const args = { numMonths: 1 };
  describe("getLineChart()", () => {
    it("should work with PAIN_LEVEL", async () => {
      const result = await charts.getLineChart(args, req);
      console.log({ result });
    });
  });
  xdescribe("getLineChartSelections", () => {
    it("should return correct selections", () => {
      const result = charts.getLineChartSelections();
    });
  });
});
