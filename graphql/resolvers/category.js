const { categories, options, lastUsed, suggested } = require("./temp_data");

const getCategoryByIdHelper = (id) => {
  const category = categories.filter((o) => o._id == id)[0];
  return category;
};

const getOptionByIdHelper = (id) => {
  const option = options.filter((o) => o._id == id)[0];
  return option;
};

const getOption = (args, req) => {
  return getOptionByIdHelper(args.id);
};

const getLastUsed = (args, req) => {
  let optionIds = lastUsed[args.uid];
  if (!optionIds) optionIds = suggested;
  console.log(optionIds);
  const categoryIds = new Set();
  const options = optionIds.map((id) => {
    const option = getOptionByIdHelper(id);
    categoryIds.add(option.categoryId);
    return option;
  });
  const categories = [...categoryIds].map((id) => getCategoryByIdHelper(id));
  return { categories, options };
};

module.exports = {
  option: getOption,
  lastUsed: getLastUsed,
};
