const {
  getUserRecordsCategory,
  getUserRecordsByCategoryDayTotal,
  getCategoryById,
  getPositivity,
} = require("../../../postgres/queries");

const queries = require("../../../postgres/queries");

const utils = require("../utils/chartsUtils");

/**
 * aggregate data by count according to whether they belong to positives or negatives
 * @return {{title: string, seriesData: [{ xlabel: string, ylabel: string, xunit: string, yunit: string, xmin: Date, xmax: Date, ymin: number, ymax: number, data: [{x: Date, y: number}]}]}}
 */
exports.getAggregate = async (
  args,
  req,
  {
    getUserRecordsByCategory = queries.getUserRecordsByCategory,
    getPositivity = queries.getPositivity,
  }
) => {
  try {
    const data = await getUserRecordsByCategory({
      uid: req.uid,
      categoryId: args.categoryId,
      numMonths: args.numMonths + " month",
    });
    const { positives, negatives } = await getPositivity(args.categoryId);
    const { range, results } = utils.aggregateData({
      data,
      positives,
      negatives,
    });
    const series = {
      xlabel: "date",
      ylabel: `${args.categoryName} level`,
      xunit: "date",
      yunit: "",
      ...range,
      data: results,
    };
    return {
      title: `Trend of my ${args.categoryName} level`,
      seriesData: [series],
    };
  } catch (error) {
    throw error;
  }
};

exports.getDailyTotal = async (args, req, yTransformation) => {
  try {
    const data = await getUserRecordsByCategoryDayTotal(
      req.uid,
      args.categoryId,
      args.numMonths + " month",
      args.type
    );

    const categoryInfo = await getCategoryById(args.categoryId);
    // console.log(categoryInfo);
    const { range, results } = utils.yTransformData({ data, yTransformation });
    const series = {
      xlabel: "date",
      ylabel: categoryInfo.name + " " + args.type,
      ...range.get(),
      xunit: "date",
      yunit: args.unit,
      data: results,
    };
    // console.log(series);
    return {
      title: `Everyday ${args.categoryName} ${args.type} (${args.unit})`,
      seriesData: [series],
    };
  } catch (error) {
    throw error;
  }
};
