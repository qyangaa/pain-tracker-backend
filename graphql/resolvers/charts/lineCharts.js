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
    const { positives, negatives } = await getPositivity({
      categoryId: args.categoryId,
    });
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

/**
 * aggregate all data with given categoryId by value
 * @return {{title: string, seriesData: [{ xlabel: string, ylabel: string, xunit: string, yunit: string, xmin: Date, xmax: Date, ymin: number, ymax: number, data: [{x: Date, y: number}]}]}}
 */
exports.getDailyTotal = async (
  args,
  req,
  yTransformation,
  {
    getUserRecordsByCategoryDayTotal = queries.getUserRecordsByCategoryDayTotal,
    getCategoryById = queries.getCategoryById,
  }
) => {
  try {
    const data = await getUserRecordsByCategoryDayTotal({
      uid: req.uid,
      categoryId: args.categoryId,
      numMonths: args.numMonths + " month",
    });

    const categoryInfo = await getCategoryById({ categoryId: args.categoryId });
    // console.log(categoryInfo);
    const { range, results } = utils.yTransformData({ data, yTransformation });
    const series = {
      xlabel: "date",
      ylabel: categoryInfo.name,
      ...range,
      xunit: "date",
      yunit: args.unit,
      data: results,
    };
    // console.log(series);
    return {
      title: `Everyday ${args.categoryName} (${args.unit})`,
      seriesData: [series],
    };
  } catch (error) {
    throw error;
  }
};
