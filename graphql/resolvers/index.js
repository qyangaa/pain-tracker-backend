const categoryResolver = require("./category.js");
const recordResolver = require("./records.js");
const chartResolver = require("./charts.js");

const rootResolver = {
  ...categoryResolver,
  ...recordResolver,
  ...chartResolver,
};

module.exports = rootResolver;
