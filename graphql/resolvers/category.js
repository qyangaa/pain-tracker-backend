const {
  getLastUsed,
  categoriesLoader,
  optionsLoader,
  searchOptionQuery,
} = require("../../postgres/queries");

const utils = require("./utils/optionUtils");

const queries = require("../../postgres/queries");

/**
 * search option by full word input
 * @return {[{_id: number, categoryId: number, title: string, value: number, src: string, srcActive: string, iconName: string}]}
 */
exports.searchOption = async (
  args = { text: "" },
  req,
  {
    searchOptionQuery = queries.searchOptionQuery,
    transformOptionOutput = utils.transformOptionOutput,
  }
) => {
  const options = await searchOptionQuery({
    text: args.text,
    categoryId: args.categoryId,
  });
  options.forEach((option) => {
    transformOptionOutput({ option });
    option.selected = true;
  });
  return options;
};

/**
 * get last used options grouped by category
 * @return {[{_id: number;name: string;title: string; options: {_id: number, categoryId: number, title: string, value: number, src: string, srcActive: string, iconName: string}}]}
 */
exports.lastUsed = async (
  args,
  req = { uid: 1 },
  {
    getLastUsed = queries.getLastUsed,
    optionsLoader = queries.optionsLoader,
    categoriesLoader = queries.categoriesLoader,
  }
) => {
  try {
    // get last used options: lastUsed: [{option: selected}]
    const { options: optionIds, selected, value: values } = await getLastUsed(
      req.uid
    );
    const propertiesMap = utils.getOptionsPropertiesMap({
      optionIds,
      selected,
      values,
    });
    const options = await optionsLoader({ optionIds });

    const { category2options, categoryIds } = utils.getCategory2OptionsMap({
      options,
      propertiesMap,
    });
    // Organize optios by categories
    const categories = await categoriesLoader(Array.from(categoryIds));
    utils.addOptions2Categories({ categories, category2options });
    return categories;
  } catch (error) {
    return error;
  }
};
