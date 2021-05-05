const utils = require("../graphql/resolvers/utils/optionUtils");
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

const option_output_test = {
  _id: 16,
  categoryId: 1,
  title: "less pain",
  value: 30,
  src,
  srcActive,
  unit: null,
  iconName,
};

describe.only("optionUtils.js", () => {
  describe("getIconUrl()", () => {
    it("should return correct src and srcActive", () => {
      const result = utils.getIconUrl({ name: iconName });
      assert.strictEqual(result.src, src);
      assert.strictEqual(result.srcActive, srcActive);
    });
  });

  describe("transformOptionOutput()", () => {
    it("should add src, srcActive, value if not keepDefault", () => {
      const option = { ...option_test };
      utils.transformOptionOutput({ option });
      assert.deepStrictEqual(option, option_output_test);
    });
    it("have defualtValue if keepDefault = true", () => {
      const option = { ...option_test };
      const output = {
        ...option_output_test,
        defaultValue: option_test.defaultValue,
      };
      utils.transformOptionOutput({ option, keepDefault: true });
      assert.deepStrictEqual(option, output);
    });
  });

  const optionIds = [16, 25];
  const selected = [false, true];
  const values = [null, 20];
  const propertiesMap_output = {
    16: { _id: optionIds[0], selected: selected[0], value: values[0] },
    25: { _id: optionIds[1], selected: selected[1], value: values[1] },
  };

  describe("getOptionsPropertiesMap()", () => {
    it("should return correct outputPropertiesMap", () => {
      const result = utils.getOptionsPropertiesMap({
        optionIds,
        selected,
        values,
      });
      assert.deepStrictEqual(result, propertiesMap_output);
    });
  });

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

  const options_output = [
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

  const categoryIds_output = new Set([1, 2]);

  const category2options_output = {
    1: [options_output[0]],
    2: [options_output[1]],
  };

  describe("getCategory2OptionsMap()", () => {
    it("should return correct categoryIds set", () => {
      const result = utils.getCategory2OptionsMap({
        options: JSON.parse(JSON.stringify(options)), // deep clone
        propertiesMap: { ...propertiesMap_output },
      });
      assert.deepStrictEqual(result.categoryIds, categoryIds_output);
    });
    it("should return correct outputPropertiesMap", () => {
      const result = utils.getCategory2OptionsMap({
        options: JSON.parse(JSON.stringify(options)),
        propertiesMap: { ...propertiesMap_output },
      });
      assert.deepStrictEqual(result.category2options, category2options_output);
    });
  });

  const categories_test = [{ _id: 1 }, { _id: 2 }];

  const categories_output = [
    { _id: 1, options: [options_output[0]] },
    { _id: 2, options: [options_output[1]] },
  ];

  describe("addOptions2Categories()", () => {
    it("should return correct categories with options list", () => {
      utils.addOptions2Categories({
        categories: categories_test,
        category2options: category2options_output,
      });
      assert.deepStrictEqual(categories_test, categories_output);
    });
  });
});
