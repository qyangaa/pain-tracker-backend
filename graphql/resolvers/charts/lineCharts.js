const {
  getUserRecordsCategory,
  getUserRecordsByCategoryDayTotal,
  getCategoryById,
  getPositivity,
} = require("../../../postgres/queries");

const utils = require("../utils/chartsUtils");

exports.getAggregate = async (args, req) => {
  try {
    const data = await getUserRecordsCategory(
      req.uid,
      args.categoryId,
      args.numMonths + " month"
    );
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

exports.getDailyTotal = async (args, req, yTransformation = (d) => d) => {
  try {
    const data = await getUserRecordsByCategoryDayTotal(
      req.uid,
      args.categoryId,
      args.numMonths + " month",
      args.type
    );

    const categoryInfo = await getCategoryById(args.categoryId);
    // console.log(categoryInfo);
    const results = [];
    const range = new DataRange();
    data.forEach((item) => {
      let x = item.date;
      let y = yTransformation(item[args.type]);
      range.update({ x, y });
      results.push({ x, y });
    });
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
