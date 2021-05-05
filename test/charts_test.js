const charts = require("../graphql/resolvers/charts");
const assert = require("assert");
const lineCharts = require("./injections/lineCharts");

describe("charts.js", () => {
  const req = { uid: 1 };
  const args = { numMonths: 1 };
  describe("getLineChart()", () => {
    it("should work with PAIN_LEVEL", async () => {
      args.type = lineCharts.lineTypes.PAIN_LEVEL;
      const result = await charts.getLineChart(args, req, lineCharts);
      assert.deepStrictEqual(result, lineCharts.dummyLineData);
    });
    it("should work with EXERCISE_DURATION", async () => {
      args.type = lineCharts.lineTypes.EXERCISE_DURATION;
      const result = await charts.getLineChart(args, req, lineCharts);
      assert.deepStrictEqual(result, lineCharts.dummyLineData);
    });
    it("should work with MOOD_LEVEL", async () => {
      args.type = lineCharts.lineTypes.MOOD_LEVEL;
      const result = await charts.getLineChart(args, req, lineCharts);
      assert.deepStrictEqual(result, lineCharts.dummyLineData);
    });
    it("should work without injection", async () => {
      args.type = lineCharts.lineTypes.MOOD_LEVEL;
      const result = await charts.getLineChart(args, req);
    });
  });
  describe("getLineChartSelections", () => {
    it("should return correct selections", () => {
      const result = charts.getLineChartSelections(lineCharts.lineTypes);
      assert.deepStrictEqual(result, lineCharts.lineTypes_output);
    });
    it("should work without injection", () => {
      const result = charts.getLineChartSelections();
    });
  });
});
