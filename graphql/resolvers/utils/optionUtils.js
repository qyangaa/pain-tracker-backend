exports.getIconUrl = ({ name, platform = "reactNative" }) => {
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

exports.transformOptionOutput = ({
  option,
  getIconUrl = this.getIconUrl,
  keepDefault = false,
}) => {
  const { src, srcActive } = getIconUrl({ name: option.iconName });
  option.src = src;
  option.srcActive = srcActive;
  option.value = option.defaultValue;
  if (!keepDefault) delete option.defaultValue;
};

/**
 * get options to value, selected map
 * @return {{_id: number, value: number, selected: boolean}}
 */
exports.getOptionsPropertiesMap = ({
  optionIds = [25],
  selected = [true],
  values = [30],
}) => {
  const propertiesMap = {};
  for (let i = 0; i < optionIds.length; i++) {
    propertiesMap[optionIds[i]] = {
      _id: optionIds[i],
      selected: selected[i] || false,
      value: values[i] || null,
    };
  }
  return propertiesMap;
};

/**
 * get category options map and set of categoryIds
 * @typedef {{  _id: number, categoryId: number, value: number, src, string, srcActive: string, iconName: string}} Option
 * @return {{categoryIds: Set<number>, category2options: {options: [Option]}}}
 */
exports.getCategory2OptionsMap = ({
  options,
  propertiesMap,
  transformOptionOutput = this.transformOptionOutput,
}) => {
  const categoryIds = new Set();
  const category2options = {};
  options.map((option) => {
    const categoryId = option.categoryId;
    categoryIds.add(categoryId);
    transformOptionOutput({ option, keepDefault: true });
    if (!category2options[categoryId])
      // Fill with last used selections
      category2options[categoryId] = [];

    option.selected = propertiesMap[option._id].selected;
    option.value = propertiesMap[option._id].value || option.defaultValue;
    delete option.defaultValue;
    category2options[categoryId].push(option);
  });
  return { category2options, categoryIds };
};

exports.addOptions2Categories = ({ categories, category2options }) => {
  categories.forEach((category) => {
    category.options = category2options[category._id.toString()];
  });
};
