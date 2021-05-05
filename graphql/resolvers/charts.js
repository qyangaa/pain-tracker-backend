const queries = require("../../postgres/queries");

const lineCharts = require("./charts/lineCharts");

/**
 * get line chart of category and chart type specified
 */
exports.getLineChart = async (args, req, lines = lineCharts) => {
  try {
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
exports.getLineChartSelections = (lineTypes = lineCharts.lineTypes) => {
  return Object.entries(lineTypes).map(([key, value]) => ({
    id: key,
    name: value,
  }));
};

exports.getContribution = async (
  args,
  req,
  getUserRecordsByOptions = queries.getUserRecordsByOptions,
  getUserRecordsByCategoryDayOptions = queries.getUserRecordsByCategoryDayOptions
) => {
  try {
    const targetData = await getUserRecordsByOptions(
      req.uid,
      [args.optionId],
      args.numMonths + " month"
    );
    const categoryData = await getUserRecordsByCategoryDayOptions(
      req.uid,
      args.categoryId,
      args.numMonths + " month"
    );
    // console.log(targetData[0], categoryData[0]);
    const hashMap = {};
    let start = 0;
    targetData.forEach((item) => {
      while (
        categoryData[start] &&
        categoryData[start].date <= item.date - parseInt(args.extension)
      )
        start++;
      for (
        let i = start;
        categoryData[i] && categoryData[i].date <= item.date;
        i++
      ) {
        for (let optionName of categoryData[i].optionName) {
          if (!hashMap[optionName]) hashMap[optionName] = 0;
          hashMap[optionName]++;
        }
      }
    });
    const series = { xlabel: "item", ylabel: "count", data: [] };
    // console.log(hashMap);

    if (Object.keys(hashMap).length !== 0) {
      let sum = Object.values(hashMap).reduce((total, d) => total + d);
      const results = Object.entries(hashMap).map((e) => ({
        x: e[0],
        y: Math.round((e[1] / sum) * 100),
      }));
      results.sort((d1, d2) => -d1.y + d2.y);
      // console.log(results);
      series.data = results.slice(0, 10);
    }
    return {
      title: `Contribution of ${args.categoryName} on ${args.optionName}`,
      seriesData: [series],
    };
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
