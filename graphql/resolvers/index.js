const categoryResolver = require("./category.js");
const recordResolver = require("./records.js");

const rootResolver = {
  ...categoryResolver,
  ...recordResolver,
};

module.exports = rootResolver;
