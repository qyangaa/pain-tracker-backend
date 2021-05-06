const assert = require("assert");

const recordUtils = require("../graphql/resolvers/utils/recordUtils");

const records = [
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
];

const req = { uid: 1 };

const populatedLastUsed = {
  options: [16, 18, 19, 22],
  selected: [true, true, true, true],
  value: [0, 0, 0, 30],
  uid: 1,
};

const populatedCategory2Options = {
  1: new Set([16]),
  2: new Set([18, 19]),
  3: new Set([22]),
};

describe("recordUtils.js", () => {
  describe("populateLasteUsed", () => {
    let lastUsed;
    let category2Options;
    beforeEach(() => {
      lastUsed = {
        options: [],
        selected: [],
        value: [],
        uid: req.uid,
      };
      category2Options = recordUtils.populateLastUsed({
        records,
        lastUsed,
      });
    });
    it("should populate lastUsed correctly", () => {
      assert.deepStrictEqual(lastUsed, populatedLastUsed);
    });
    it("should return correct category2options map", () => {
      assert.deepStrictEqual(category2Options, populatedCategory2Options);
    });
  });

  describe("fillLastUsedToLength()", () => {
    it("lastUsed entries should have filled correct length", () => {
      const length = 4;
      const lastUsed = JSON.parse(JSON.stringify(populatedLastUsed));
      recordUtils.fillLastUsedToLength({
        lastUsed: lastUsed,
        category2Options: populatedCategory2Options,
        length: length,
      });
      const correctLength = 2 + 4 + 4; //2 for category 1, 4 for category 2, 3
      assert.strictEqual(lastUsed.options.length, correctLength);
      assert.strictEqual(lastUsed.selected.length, correctLength);
      assert.strictEqual(lastUsed.value.length, correctLength);
    });
  });

  describe("createLastUsedEntry()", () => {
    it("should return correct lastUsed", () => {
      const correctLastUsed = {
        options: [16, 18, 19, 22, 17, 20, 21, 23, 24, 25],
        selected: [
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
        value: [0, 0, 0, 30, 0, 0, 0, 0, 0, 0],
        uid: 1,
      };
      const lastUsed = recordUtils.createLastUsedEntry({ records, uid: 1 });
      assert.deepStrictEqual(lastUsed, correctLastUsed);
    });
  });
});
