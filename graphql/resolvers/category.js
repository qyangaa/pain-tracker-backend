const {
  getLastUsed,
  categoriesLoader,
  optionsLoader,
  searchOptionQuery,
} = require("../../postgres/queries");

const getIconUrl = (name, platform = "reactNative") => {
  if (!name) {
    return {
      src: "https://via.placeholder.com/150",
      srcActive: "https://via.placeholder.com/150",
    };
  }
  let suffix;
  if (platform === "reactNative") suffix = "hdpi";
  const src = `https://firebasestorage.googleapis.com/v0/b/pain-tracker-934d3.appspot.com/o/assets%2Ficons%2F${name}%2F${name}_outline_${suffix}.png?alt=media`;
  const srcActive = `https://firebasestorage.googleapis.com/v0/b/pain-tracker-934d3.appspot.com/o/assets%2Ficons%2F${name}%2F${name}_solid_${suffix}.png?alt=media`;
  return { src, srcActive };
};

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
    } = await getLastUsed(req.uid);
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
      // Get Url
      const { src, srcActive } = getIconUrl(option.icon_name, "reactNative");
      option.src = src;
      option.srcActive = srcActive;
      if (!category2options[categoryId])
        // Fill with last used selections
        category2options[categoryId] = [];
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

exports.searchOption = async (args, req) => {
  const options = await searchOptionQuery(args.text.trim(), args.categoryId);
  options.forEach((option) => {
    const { src, srcActive } = getIconUrl(option.icon_name, "reactNative");
    option.src = src;
    option.srcActive = srcActive;
    option.selected = true;
    option.duration = 30;
    option.amount = 0;
  });
  return options;
};
