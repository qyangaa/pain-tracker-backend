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

/**
 * aggregate data by count according to whether they belong to positives or negatives
 * @param {{data: [{optionId: number, value: number, date: Date}], positives: Set<number>, negatives: Set<number>}}
 * @return {{range: {xmin: Date, xmax: Date, ymin: number, ymax: number}, results: [{x: Date, y: number}]}}
 */
const aggregateData = ({ data, positives, negatives }) => {
  let level = 0;
  const results = [];
  const range = new DataRange();
  data.forEach((item) => {
    if (negatives.has(item.optionId)) level--;
    else if (positives.has(item.optionId)) level++;
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
  const rangeResult = range.get();
  return {
    range: {
      xmin: new Date(rangeResult.xmin),
      xmax: new Date(rangeResult.xmax),
      ymin: rangeResult.ymin,
      ymax: rangeResult.ymax,
    },
    results,
  };
};

module.exports = { DataRange: DataRange, aggregateData: aggregateData };
