const queries = require("../../../postgres/queries");
const utils = require("../utils/chartsUtils");

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

    const series = { xlabel: "item", ylabel: "count", data: [] };
    const { counts } = utils.getContributionCounts({
      targetData,
      categoryData,
      extension: parseInt(args.extension),
    });
    const sortedPercentageCounts = utils.getSortedPercentageCounts({ counts });
    series.data = sortedPercentageCounts.slice(0, 10);

    return {
      title: `Contribution of ${args.categoryName} on ${args.optionName}`,
      seriesData: [series],
    };
  } catch (error) {
    throw error;
  }
};
