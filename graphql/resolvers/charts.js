const queries = require("../../postgres/queries");

const lineCharts = require("./charts/lineCharts");
const pieCharts = require("./charts/pieCharts");

/**
 * get line chart of category and chart type specified
 */
exports.getLineChart = async (args, req, context, lines = lineCharts) => {
  try {
    console.log(req.uid);
    const lineTypes = lines.lineTypes;
    if (Object.values(lineTypes).indexOf(args.type) === -1)
      throw new Error("Invalid lineType");
    let data;
    let yTransformation;
    switch (args.type) {
      case lineTypes.PAIN_LEVEL:
        args.categoryId = 1;
        args.categoryName = "pain";
        data = await lines.getAggregate({ args, req });
        return data;
      case lineTypes.EXERCISE_DURATION:
        args.categoryId = 3;
        args.categoryName = "exercise";
        args.unit = "hrs";
        yTransformation = (d) => (d / 60).toFixed(1);
        data = await lines.getDailyTotal({ args, req, yTransformation });
        return data;
      case lineTypes.MOOD_LEVEL:
        args.categoryId = 2;
        args.categoryName = "mood";
        data = await lines.getAggregate({ args, req });
        return data;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Map lineType from enum to array of id, name pair
 * @param {{lineTypes: {key: string}}}
 * @return {[{key: string, name: string}]}
 */
exports.getLineChartSelections = (
  args,
  req,
  context,
  lineTypes = lineCharts.lineTypes
) => {
  return Object.entries(lineTypes).map(([key, value]) => ({
    _id: key,
    name: value,
  }));
};

exports.getPieChart = async (args, req, pies = pieCharts) => {
  try {
    const result = await pies.getContribution(args, req);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getPieChartSelections = async (args, req) => {
  try {
    const categories = await getContributorCategories();
    const options = await getContributeeOptions();
    console.log({ categories, options });
    return { categories, options };
  } catch (error) {
    throw error;
  }
};
