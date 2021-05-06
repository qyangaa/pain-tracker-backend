const pieCharts = require("../graphql/resolvers/charts/pieCharts");
const testUtils = require("./utils/chartTestUtils");

const assert = require("assert");

const getUserRecordsByOptions = ({ uid, optionIds, numMonths }) => {
  testUtils.checkParametersOptions({ uid, optionIds, numMonths });
  const records = [
    { optionId: 5, value: 1, date: new Date("01/05/2015") },
    { optionId: 5, value: 1, date: new Date("01/08/2015") },
  ];
  return records;
};

const getUserRecordsByCategoryDayOptions = ({ uid, categoryId, numMonths }) => {
  testUtils.checkParametersCategory({ uid, categoryId, numMonths });
  const records = [
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
      optionIds: [1, 2],
      optionNames: ["opt1", "opt2"],
    },
    {
      date: new Date("01/07/2015"),
      optionIds: [2],
      optionNames: ["opt2"],
    },
  ];
  return records;
};

describe("pieCharts.js", () => {
  const args = {
    extension: "3",
    categoryName: "test category",
    categoryId: 2,
    optionName: "test option",
    optionId: 16,
    numMonths: 4,
  };
  const req = { uid: 1 };
  describe("getContribution()", () => {
    it("should return correct contribution data", async () => {
      const result = await pieCharts.getContribution(
        args,
        req,
        getUserRecordsByOptions,
        getUserRecordsByCategoryDayOptions
      );
      const correctResults = [
        { x: "opt2", y: 60 },
        { x: "opt1", y: 40 },
      ];
      assert.deepStrictEqual(result.seriesData[0].data, correctResults);
    });
    it("should work without injection (y sum to 100 or no data)", async () => {
      const result = await pieCharts.getContribution(args, req);
      if (!result.seriesData[0]) return true;
      const sum = result.seriesData[0].data.reduce(
        (total, d) => total + d.y,
        0
      );
      assert.strictEqual(sum, 100);
    });
  });
});
