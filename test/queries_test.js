const {
  getUid,
  categoriesLoader,
  optionsLoader,
  getLastUsed,
  uploadRecords,
  updateLastUsed,
  getLastUploadedRecords,
  deleteUserRecords,
  searchOptionQuery,
  getUserRecordsByOptions,
  getUserRecordsByCategoryDayTotal,
  getUserRecordsByCategoryDayOptions,
  getCategoryById,
  getContributorCategories,
  getContributeeOptions,
  getPositivity,
} = require("../postgres/queries");
const assert = require("assert");

describe.only("queries.js", () => {
  describe("getUid()", () => {
    it("should return integer uid", async () => {
      const authId = "dummyAuthId";
      const user_id = await getUid({ authId });
      assert.strictEqual(user_id, 1);
    });
  });

  describe("categoriesLoader()", () => {
    it("should return correct category", async () => {
      const categoryIds = [1];
      const result = await categoriesLoader({ categoryIds });
      assert.deepStrictEqual(result, [
        { _id: 1, name: "pain", title: "Today I am" },
      ]);
    });
  });

  describe("getCategoryById()", () => {
    it("should return correct category", async () => {
      const categoryId = 1;
      const result = await getCategoryById({ categoryId });
      assert.deepStrictEqual(result, {
        _id: 1,
        name: "pain",
        isContributor: true,
        title: "Today I am",
      });
    });
  });

  describe("optionsLoader()", () => {
    it("should return correct option", async () => {
      const optionIds = [16];
      const result = await optionsLoader({ optionIds });
      assert.deepStrictEqual(result, [
        {
          _id: 16,
          categoryId: 1,
          title: "less pain",
          defaultValue: null,
          unit: null,
          iconName: "heart",
        },
      ]);
    });
  });

  const lastUsed = {
    options: [16, 18],
    categories: [1, 2],
    selected: [true, true],
    value: [0, 0],
  };
  const uid = 1;

  describe("updateLastUsed()", () => {
    it("should return true", async () => {
      const result = await updateLastUsed({ uid, lastUsed });
      assert.strictEqual(result, true);
    });
  });

  describe("getLastUsed()", () => {
    it("should return last used lists", async () => {
      const result = await getLastUsed({ uid });
      assert.deepStrictEqual(result.options, lastUsed.options);
      assert.deepStrictEqual(result.selected, lastUsed.selected);
      assert.deepStrictEqual(result.value, lastUsed.value);
    });
  });

  describe("user records", () => {
    const records = [
      {
        _id: 16,
        categoryId: 1,
        selected: true,
        value: null,
      },

      {
        _id: 23,
        categoryId: 2,
        selected: true,
        value: 30,
      },
      {
        _id: 25,
        categoryId: 2,
        selected: true,
        value: 50,
      },
    ];

    const date = new Date("05/03/2021");
    date.setHours(0, 0, 0, 0);
    const optionIdx = 0;
    const optionIds = [records[optionIdx]._id];
    const categoryIdx = 1;
    const categoryId = records[categoryIdx].categoryId;
    const option_names = ["weight", "swimming"]; //names of options with categoryId
    const option_units = ["minutes", "minutes"];
    const numMonths = "1 month";

    describe("deleteUserRecords()", () => {
      it("should return true", async () => {
        const result = await deleteUserRecords({ uid });
        assert.strictEqual(result, true);
      });
    });

    describe("uploadRecords()", () => {
      it("should return true", async () => {
        const result = await uploadRecords({ uid, records, date });
        assert.strictEqual(result, true);
      });
    });

    describe("getLastUploadedRecords()", () => {
      it("should return correct records", async () => {
        const result = await getLastUploadedRecords({
          uid,
          count: records.length,
        });
        result.forEach((d) => {
          d.selected = true;
        });
        assert.deepStrictEqual(result.reverse(), records);
      });
    });

    describe("getUserRecordsByOptions()", () => {
      it("should return correct records", async () => {
        const result = await getUserRecordsByOptions({
          uid,
          optionIds,
          numMonths,
        });
        assert.deepStrictEqual(result[0].optionId, records[optionIdx]._id);
        assert.deepStrictEqual(result[0].value, records[optionIdx].value);
        assert.deepStrictEqual(result[0].date, date);
      });
    });

    describe("getUserRecordsByCategoryDayTotal()", () => {
      it("should return record with correct sum of value", async () => {
        const result = await getUserRecordsByCategoryDayTotal({
          uid,
          categoryId,
          numMonths,
        });
        let sum = 0;
        records.forEach((d) => {
          if (d.categoryId == categoryId) sum += d.value;
        });
        assert.deepStrictEqual(result[0].value, sum);
      });
    });

    describe("getUserRecordsByCategoryDayOptions()", () => {
      it("should return record with correct sum of value", async () => {
        const result = await getUserRecordsByCategoryDayOptions({
          uid,
          categoryId,
          numMonths,
        });
        const option_ids = [];
        records.forEach((d) => {
          if (d.categoryId == categoryId) option_ids.push(d._id);
        });
        assert.deepStrictEqual(result[0].optionIds, option_ids);
        assert.deepStrictEqual(result[0].optionNames, option_names);
        assert.deepStrictEqual(result[0].units, option_units);
      });
    });
  });

  describe("selection providers", () => {
    describe("getContributorCategories()", () => {
      it("pain, mood, exercise should all be in results", async () => {
        const result = await getContributorCategories();
        const found = new Set();
        result.forEach((d) => {
          found.add(d._id);
        });
        assert(found.has(1));
        assert(found.has(2));
        assert(found.has(3));
      });
    });

    describe("getContributeeOptions()", () => {
      let result;
      beforeEach(async () => {
        result = await getContributeeOptions();
      });
      it("option 16, 17, 19 should all be in results", () => {
        const found = new Set();
        result.forEach((d) => {
          found.add(d._id);
        });
        assert(found.has(16));
        assert(found.has(17));
        assert(found.has(19));
      });
      it("unit should be defined", () => {
        assert(result[0].unit !== undefined);
      });
      it("name should be defined", () => {
        assert(result[0].name !== undefined);
      });
    });

    describe("getPositivity()", () => {
      it("option 16 should be negative and 17 should be positive", async () => {
        const categoryId = 1;
        const result = await getPositivity({ categoryId });
        assert(result.negatives.has(16));
        assert(result.positives.has(17));
      });
    });
  });

  describe("searchOptionQuery()", () => {
    it("search should give correct results", async () => {
      const text = "happy ";
      const categoryId = 2;
      const result = await searchOptionQuery({ text, categoryId });
      const expectedOption = {
        _id: 20,
        categoryId: 2,
        title: "happy",
        defaultValue: 0,
        unit: null,
        iconName: "happy",
      };
      assert.deepStrictEqual(result[0], expectedOption);
    });
  });
});
