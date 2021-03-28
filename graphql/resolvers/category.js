const { suggested } = require("./temp_data");
const Option = require("../../mongodbModels/option");
const Category = require("../../mongodbModels/category");
const LastUsed = require("../../mongodbModels/lastUsed");
const DataLoader = require("dataloader");

const categoriesLoader = new DataLoader((categoryIds) => {
  return Category.find({ _id: { $in: categoryIds } });
});

const optionsLoader = new DataLoader((optionIds) => {
  return Option.find({ _id: { $in: optionIds } });
});

const getCategoryByIdHelper = async (id) => {
  const category = await Category.findById(id);
  return category._doc;
};

const getOptionByIdHelper = async (id) => {
  const option = await Option.findById(id);
  return option._doc;
};

const getLastUsedByUidHelper = async (uid) => {
  const options = await LastUsed.findById(uid);
  return options._doc.options;
};

exports.option = (args, req) => {
  return getOptionByIdHelper(args.id);
};

exports.lastUsed = async (args, req) => {
  try {
    console.log(args.uid);
    let optionIds = await getLastUsedByUidHelper(args.uid);
    // if (!optionIds) optionIds = suggested;
    console.log({ optionIds });
    const options = await optionsLoader.loadMany(optionIds);
    const categoryIds = new Set();
    const category2options = {};
    options.map(async (option) => {
      const categoryId = option.categoryId.toString();
      categoryIds.add(categoryId);
      if (!category2options[categoryId]) category2options[categoryId] = [];
      option.selected = false;
      category2options[categoryId].push(option);
    });
    const categories = await categoriesLoader.loadMany(Array.from(categoryIds));
    categories.forEach((category) => {
      category.options = category2options[category._id.toString()];

      if (category.hasDuration) {
        category.options.forEach((option) => {
          option.duration = 30;
        });
      }
    });
    return categories;
  } catch (error) {
    return error;
  }
};
