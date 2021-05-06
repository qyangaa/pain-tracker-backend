const queries = require("../../../postgres/queries");
const utils = require("../utils/chartsUtils");

/**
 * aggregate all data with given categoryId by value
 * @return {{title: string, seriesData: [{ data: [{x: string, y: number}]}]}}
 */
exports.getContribution = async (
  args,
  req,
  getUserRecordsByOptions = queries.getUserRecordsByOptions,
  getUserRecordsByCategoryDayOptions = queries.getUserRecordsByCategoryDayOptions
) => {
  try {
    const targetData = await getUserRecordsByOptions({
      uid: req.uid,
      optionIds: [args.optionId],
      numMonths: utils.getMonth({ numMonths: args.numMonths }),
    });
    const categoryData = await getUserRecordsByCategoryDayOptions({
      uid: req.uid,
      categoryId: args.categoryId,
      numMonths: utils.getMonth({ numMonths: args.numMonths }),
    });

    const series = { xlabel: "item", ylabel: "count", data: [] };
    const { counts } = utils.getContributionCounts({
      targetData,
      categoryData,
      extension: parseInt(args.extension),
    });
    const sortedPercentageCounts = utils.getSortedPercentageCounts({
      counts,
      slice: args.slice || 10,
    });
    return {
      title: `Contribution of ${args.categoryName} on ${args.optionName}`,
      seriesData: [{ data: sortedPercentageCounts }],
    };
  } catch (error) {
    throw error;
  }
};
