const utils = require("./utils/optionUtils");

const {
  getLastUsed,
  optionsLoader,
  categoriesLoader,
  searchOptionQuery,
} = require("../../postgres/queries");

/**
 * search option by full word input
 * @return {[{_id: number, categoryId: number, title: string, value: number, src: string, srcActive: string, iconName: string}]}
 */
exports.searchOption = async (
  args = { text: "" },
  req,
  context,
  _queries = { searchOptionQuery },
  _utils = { transformOptionOutput: utils.transformOptionOutput }
) => {
  const options = await _queries.searchOptionQuery({
    text: args.text,
    categoryId: args.categoryId,
  });
  options.forEach((option) => {
    _utils.transformOptionOutput({ option });
    option.selected = true;
  });
  return options;
};

/**
 * get last used options grouped by category
 * @return {[{_id: number;name: string;title: string; options: {_id: number, categoryId: number, title: string, value: number, src: string, srcActive: string, iconName: string, unit: string}}]}
 */
exports.lastUsed = async (
  args,
  req = { uid: 1 },
  context,
  _queries = { getLastUsed, optionsLoader, categoriesLoader },
  _utils = utils
) => {
  try {
    // get last used options: lastUsed: [{option: selected}]
    const {
      options: optionIds,
      selected,
      value: values,
    } = await _queries.getLastUsed({ uid: req.uid });
    const propertiesMap = _utils.getOptionsPropertiesMap({
      optionIds,
      selected,
      values,
    });
    const options = await _queries.optionsLoader({ optionIds });
    const { category2options, categoryIds } = _utils.getCategory2OptionsMap({
      options,
      propertiesMap,
    });
    // Organize optios by categories
    const categories = await _queries.categoriesLoader({
      categoryIds: Array.from(categoryIds),
    });
    _utils.addOptions2Categories({ categories, category2options });

    return categories;
  } catch (error) {
    return error;
  }
};
