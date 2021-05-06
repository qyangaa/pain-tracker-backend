const {
  option,
  lastUsed,
  searchOption,
} = require("../graphql/resolvers/category");

const assert = require("assert");
const iconName = "heart";
const suffix = "hdpi";
const src = `https://firebasestorage.googleapis.com/v0/b/pain-tracker-934d3.appspot.com/o/assets%2Ficons%2F${iconName}%2F${iconName}_outline_${suffix}.png?alt=media`;
const srcActive = `https://firebasestorage.googleapis.com/v0/b/pain-tracker-934d3.appspot.com/o/assets%2Ficons%2F${iconName}%2F${iconName}_solid_${suffix}.png?alt=media`;

const iconName2 = "icon2";
const src2 = `https://firebasestorage.googleapis.com/v0/b/pain-tracker-934d3.appspot.com/o/assets%2Ficons%2F${iconName2}%2F${iconName2}_outline_${suffix}.png?alt=media`;
const srcActive2 = `https://firebasestorage.googleapis.com/v0/b/pain-tracker-934d3.appspot.com/o/assets%2Ficons%2F${iconName2}%2F${iconName2}_solid_${suffix}.png?alt=media`;

const option_test = {
  _id: 16,
  categoryId: 1,
  title: "less pain",
  defaultValue: 30,
  unit: null,
  iconName,
};

const optionIds = [16, 25];
const selected = [false, true];
const values = [null, 20];
const lastUsed_raw = { options: optionIds, selected, value: values };
const propertiesMap_output = {
  16: { _id: optionIds[0], selected: selected[0], value: values[0] },
  25: { _id: optionIds[1], selected: selected[1], value: values[1] },
};

const options = [
  {
    _id: 16,
    categoryId: 1,
    title: "less pain",
    defaultValue: 30,
    unit: null,
    iconName,
  },
  {
    _id: 25,
    categoryId: 2,
    title: "option2",
    defaultValue: 30,
    unit: "minutes",
    iconName: iconName2,
  },
];

const options_output_test = [
  {
    _id: 16,
    categoryId: 1,
    title: "less pain",
    selected: selected[0],
    value: options[0].defaultValue,
    src,
    srcActive,
    unit: null,
    iconName,
  },
  {
    _id: 25,
    categoryId: 2,
    title: "option2",
    selected: selected[1],
    src: src2,
    srcActive: srcActive2,
    value: values[1],
    unit: "minutes",
    iconName: iconName2,
  },
];

const getLastUsed = ({ uid }) => {
  if (uid === 1) return lastUsed_raw;
};

const optionsLoader = async ({ optionIds }) => {
  if (optionIds[0] != [16]) return [];
  return options_output_test;
};

const categoriesLoader = () => {
  return [{ _id: 1 }, { _id: 2 }];
};

const searchOptionQuery = async ({ text, categoryId }) => {
  if (text != "less pain") return [];
  if (!categoryId) throw new Error("missing argument 'categoryId'");
  return [options_output_test[0]];
};

const transformOptionOutput = () => {};

describe("category.js", () => {
  let args;
  const req = { uid: 1 };
  describe("searchOption()", () => {
    it("should return correct options", async () => {
      args = { text: "less pain", categoryId: 1 };
      const result = await searchOption(
        args,
        req,
        searchOptionQuery,
        transformOptionOutput
      );
      assert.deepStrictEqual(result, [options_output_test[0]]);
    });
    it("should work without injection", async () => {
      args = { text: "less pain", categoryId: 1 };
      const result = await searchOption(args, req);
    });
  });

  const categories_output = [
    { _id: 1, options: [options_output_test[0]] },
    { _id: 2, options: [options_output_test[1]] },
  ];

  describe.only("lastUsed()", () => {
    it("should return correct categories with options list", async () => {
      const queries = { getLastUsed, optionsLoader, categoriesLoader };
      const result = await lastUsed(args, req, null, queries);
      assert.deepStrictEqual(result, categories_output);
    });
    it("should work without injection", async () => {
      const result = await lastUsed(args, req);
      assert(result.length > 0);
    });
  });
});
