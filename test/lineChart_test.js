const lineCharts = require("../graphql/resolvers/charts/lineCharts");

const assert = require("assert");

const getUserRecordsByCategory = ({
  uid,
  categoryId,
  numMonths = "1 month",
}) => {
  if (!uid) throw new Error("missing argument 'uid'");
  if (!categoryId) throw new Error("missing argument 'categoryId'");
  if (!numMonths) throw new Error("missing argument 'numMonths'");
  return [
    { optionId: 1, value: 1, date: new Date("01/01/2015") },
    { optionId: 2, value: 2, date: new Date("01/02/2015") },
    { optionId: 4, value: 2, date: new Date("01/03/2015") },
    { optionId: 3, value: 2, date: new Date("01/04/2015") },
    { optionId: 1, value: 2, date: new Date("01/05/2015") },
  ];
};

const getPositivity = (categoryId) => {
  if (!categoryId) throw new Error("missing argument 'categoryId'");
  const positives = new Set([1, 3]);
  const negatives = new Set([2, 4]);
  return { positives, negatives };
};

describe.only("lineCharts.js", () => {
  const req = { uid: 1 };
  let result;
  describe("getAggregate()", () => {
    beforeEach(async () => {
      const args = { categoryId: 1, numMonths: 1, categoryName: "test name" };
      result = await lineCharts.getAggregate(args, req, {
        getUserRecordsByCategory,
        getPositivity,
      });
    });
    it("should return correct aggregated data over days", async () => {
      const results = [
        { x: new Date("01/01/2015"), y: 1 },
        { x: new Date("01/02/2015"), y: 0 },
        { x: new Date("01/03/2015"), y: -1 },
        { x: new Date("01/04/2015"), y: 0 },
        { x: new Date("01/05/2015"), y: 1 },
      ];
      assert.deepStrictEqual(result.seriesData[0].data, results);
    });
    it("should return correct range", async () => {
      const range = {
        xmin: new Date("01/01/2015"),
        xmax: new Date("01/05/2015"),
        ymin: -1,
        ymax: 1,
      };
      assert.deepStrictEqual(result.seriesData[0].xmin, range.xmin);
      assert.deepStrictEqual(result.seriesData[0].xmax, range.xmax);
      assert.deepStrictEqual(result.seriesData[0].ymin, range.ymin);
      assert.deepStrictEqual(result.seriesData[0].ymax, range.ymax);
    });
  });
});
