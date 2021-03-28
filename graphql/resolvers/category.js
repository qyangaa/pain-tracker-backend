const { suggested } = require("../../tempData/temp_data");
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
    // get last used options: lastUsed: [{option: selected}]
    const lastUsed = await getLastUsedByUidHelper(args.uid);

    // if (!optionIds) optionIds = suggested;
    const selectedMap = lastUsed.reduce((map, obj) => {
      map[obj._id] = obj.selected;
      return map;
    }, {});
    const options = await optionsLoader.loadMany(
      lastUsed.map((item) => item._id)
    );

    // Find categories appeared
    const categoryIds = new Set();
    const category2options = {};
    options.map(async (option) => {
      const categoryId = option.categoryId.toString();
      categoryIds.add(categoryId);
      if (!category2options[categoryId]) category2options[categoryId] = [];
      option.selected = selectedMap[option._id];
      category2options[categoryId].push(option);
    });

    // Organize optios by categories
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
