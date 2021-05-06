const assert = require("assert");
const recordUtils = require("./injections/recordUtils");
const queries = require("./injections/queries");
const records = require("../graphql/resolvers/records");

describe("records.js", () => {
  const req = { uid: 1 };
  describe.only("createRecords()", () => {
    const args = {
      geoCoordinates: {
        lon: -121.9808,
        lat: 37.5502,
      },
      records: [
        {
          optionId: 16,
          categoryId: 1,
          selected: true,
          value: null,
        },
        {
          optionId: 18,
          categoryId: 2,
          selected: true,
          value: null,
        },
        {
          optionId: 19,
          categoryId: 2,
          selected: true,
          value: null,
        },
        {
          optionId: 22,
          categoryId: 3,
          selected: true,
          value: 30,
        },
      ],
    };
    it("should create records", async () => {
      await records.createRecords(args, req, recordUtils, queries);
    });
    it("should work without injections", async () => {
      await records.createRecords(args, req);
    });
  });
});
