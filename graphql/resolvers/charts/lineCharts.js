const {
  getUserRecordsCategory,
  getUserRecordsCategoryDayTotal,
  getCategoryById,
  getPositivity,
} = require("../../../postgres/queries");

class DataRange {
  constructor() {
    this.xmin = Number.MAX_VALUE;
    this.xmax = Number.MIN_VALUE;
    this.ymin = Number.MAX_VALUE;
    this.ymax = Number.MIN_VALUE;
  }
  update({ x, y }) {
    this.xmin = Math.min(this.xmin, x);
    this.xmax = Math.max(this.xmax, x);
    this.ymin = Math.min(this.ymin, y);
    this.ymax = Math.max(this.ymax, y);
  }
  get() {
    return {
      xmin: this.xmin,
      xmax: this.xmax,
      ymin: this.ymin,
      ymax: this.ymax,
    };
  }
}

exports.getAggregate = async (args, req) => {
  try {
    const data = await getUserRecordsCategory(
      req.uid,
      args.categoryId,
      args.numMonths + " month"
    );
    const { positives, negatives } = await getPositivity(args.categoryId);
    console.log(positives);
    let level = 0;
    const results = [];
    const range = new DataRange();
    data.forEach((item) => {
      console.log(item);
      if (negatives.has(item.option_id)) level--;
      else if (positives.has(item.option_id)) level++;
      if (
        results.length &&
        results[results.length - 1].date &&
        results[results.length - 1].date.toDateString() ==
          item.date.toDateString()
      )
        results.pop();
      let x = item.date;
      let y = level;
      range.update({ x, y });
      results.push({ x, y });
    });
    const series = {
      xlabel: "date",
      ylabel: `${args.categoryName} level`,
      ...range.get(),
      data: results,
    };
    // console.log(results);
    // console.log(series);
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
    const data = await getUserRecordsCategoryDayTotal(
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
      ylabel: categoryInfo.short_name + " " + args.type,
      ...range.get(),
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
