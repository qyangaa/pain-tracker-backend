const {
  getLastUsed,
  categoriesLoader,
  optionsLoader,
} = require("../../postgres/queries");

exports.option = async (args, req) => {
  const option = await optionsLoader.load(args.id);
  return option;
};

exports.lastUsed = async (args, req) => {
  try {
    // get last used options: lastUsed: [{option: selected}]
    const {
      options: optionIds,
      selected,
      duration,
      amount,
    } = await getLastUsed(args.uid);
    // if (!optionIds) optionIds = suggested;
    const propertiesMap = {};
    for (let i = 0; i < optionIds.length; i++) {
      if (!propertiesMap[optionIds[i]])
        propertiesMap[optionIds[i]] = { _id: optionIds[i] };
      propertiesMap[optionIds[i]].selected = selected[i];
      if (duration) {
        propertiesMap[optionIds[i]].duration = duration[i];
      } else {
        propertiesMap[optionIds[i]].duration = 30;
      }

      if (amount) {
        propertiesMap[optionIds[i]].amount = amount[i];
      } else {
        propertiesMap[optionIds[i]].amount = 1;
      }
    }
    const options = await optionsLoader.loadMany(optionIds);
    // Find categories appeared
    const categoryIds = new Set();
    const category2options = {};
    options.map(async (option) => {
      const categoryId = option.categoryId;
      categoryIds.add(categoryId);
      if (!category2options[categoryId]) category2options[categoryId] = [];
      option.selected = propertiesMap[option._id].selected;
      option.amount = propertiesMap[option._id].amount;
      option.duration = propertiesMap[option._id].duration;
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
