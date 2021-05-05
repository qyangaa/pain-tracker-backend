const utils = require("../graphql/resolvers/utils/chartsUtils");

const assert = require("assert");

describe("chartUtils", () => {
  describe("DataRange", () => {
    it("should return correct range", () => {
      const range = new utils.DataRange();
      range.update({ x: 1, y: 2 });
      range.update({ x: 0, y: 4 });
      range.update({ x: 3, y: 3 });
      assert.deepStrictEqual(range.get(), {
        xmin: 0,
        xmax: 3,
        ymin: 2,
        ymax: 4,
      });
    });
  });

  describe("aggregateData()", () => {
    let result;
    const data = [
      { optionId: 1, value: 1, date: new Date("01/01/2015") },
      { optionId: 2, value: 2, date: new Date("01/02/2015") },
      { optionId: 4, value: 2, date: new Date("01/03/2015") },
      { optionId: 3, value: 2, date: new Date("01/04/2015") },
      { optionId: 1, value: 2, date: new Date("01/05/2015") },
    ];
    const results = [
      { x: new Date("01/01/2015"), y: 1 },
      { x: new Date("01/02/2015"), y: 0 },
      { x: new Date("01/03/2015"), y: -1 },
      { x: new Date("01/04/2015"), y: 0 },
      { x: new Date("01/05/2015"), y: 1 },
    ];
    const range = {
      xmin: new Date("01/01/2015"),
      xmax: new Date("01/05/2015"),
      ymin: -1,
      ymax: 1,
    };
    const positives = new Set([1, 3]);
    const negatives = new Set([2, 4]);
    beforeEach(async () => {
      result = await utils.aggregateData({ data, positives, negatives });
    });
    it("should return correct range", () => {
      assert.deepStrictEqual(result.range, range);
    });
    it("should return correct results", () => {
      assert.deepStrictEqual(result.results, results);
    });
  });

  describe("yTransformData()", () => {
    let result;
    const data = [
      { value: 1, date: new Date("01/01/2015") },
      { value: 2, date: new Date("01/03/2015") },
      { value: 2, date: new Date("01/05/2015") },
    ];
    const results = [
      { x: new Date("01/01/2015"), y: 1 + 1 },
      { x: new Date("01/03/2015"), y: 2 + 1 },
      { x: new Date("01/05/2015"), y: 2 + 1 },
    ];
    const range = {
      xmin: new Date("01/01/2015"),
      xmax: new Date("01/05/2015"),
      ymin: 1 + 1,
      ymax: 2 + 1,
    };
    beforeEach(async () => {
      result = await utils.yTransformData({
        data,
        yTransformation: (d) => d + 1,
      });
    });
    it("should return correct results.", () => {
      assert.deepStrictEqual(result.results, results);
    });
    it("should return correct range.", () => {
      assert.deepStrictEqual(result.range, range);
    });
  });

  describe("getMonth()", () => {
    it("should return '1 month", () => {
      const result = utils.getMonth(1);
      assert.strictEqual(result, "1 month");
    });
  });

  describe("getContributionCounts()", () => {
    const targetData = [
      { optionId: 5, value: 1, date: new Date("01/05/2015") },
      { optionId: 5, value: 1, date: new Date("01/08/2015") },
    ];
    const categoryData = [
      {
        date: new Date("01/01/2015"),
        optionIds: [1, 2, 3],
        optionNames: ["opt1", "opt2", "opt3"],
      },
      {
        date: new Date("01/03/2015"),
        optionIds: [1, 2],
        optionNames: ["opt1", "opt2"],
      },
      {
        date: new Date("01/05/2015"),
        optionIds: [1],
        optionNames: ["opt1"],
      },
      {
        date: new Date("01/07/2015"),
        optionIds: [2],
        optionNames: ["opt2"],
      },
    ];
    it(`should return correct counts: extension = 5`, () => {
      const extension = 5;
      const result = utils.getContributionCounts({
        targetData,
        categoryData,
        extension,
      });
      const correctCounts = { opt1: 3, opt2: 3, opt3: 1 };
      assert.deepStrictEqual(result.counts, correctCounts);
    });
    it(`should return correct counts with skipped days: extension = 3`, () => {
      const extension = 3;
      const result = utils.getContributionCounts({
        targetData,
        categoryData,
        extension,
      });
      const correctCounts = { opt1: 2, opt2: 2 };
      assert.deepStrictEqual(result.counts, correctCounts);
    });
    it(`should return correct counts with only days of target: extension = 1`, () => {
      const extension = 1;
      const result = utils.getContributionCounts({
        targetData,
        categoryData,
        extension,
      });
      const correctCounts = { opt1: 1 };
      assert.deepStrictEqual(result.counts, correctCounts);
    });
  });

  describe.only("getSortedPercentageCounts()", () => {
    it(`should return correct percentage counts`, () => {
      const counts = { opt1: 4, opt2: 5, opt3: 1 };
      const correctResults = [
        { x: "opt2", y: 50 },
        { x: "opt1", y: 40 },
        { x: "opt3", y: 10 },
      ];
      const results = utils.getSortedPercentageCounts({ counts });
      assert.deepStrictEqual(results, correctResults);
    });
  });
});
