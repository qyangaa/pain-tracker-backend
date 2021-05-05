class DataRange {
  constructor(xDate = false) {
    this.xmin = Number.MAX_VALUE;
    this.xmax = Number.MIN_VALUE;
    this.ymin = Number.MAX_VALUE;
    this.ymax = Number.MIN_VALUE;
    this.xDate = xDate;
  }
  update({ x, y }) {
    this.xmin = Math.min(this.xmin, x);
    this.xmax = Math.max(this.xmax, x);
    this.ymin = Math.min(this.ymin, y);
    this.ymax = Math.max(this.ymax, y);
    if (this.xDate) {
      this.xmin = new Date(this.xmin);
      this.xmax = new Date(this.xmax);
    }
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
  const range = new DataRange(true);
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
  return {
    range: range.get(),
    results,
  };
};

/**
 * transform all y values in a line data set
 * @param {{data: [{value: number, date: Date}]}}
 * @return {{range: {xmin: Date, xmax: Date, ymin: number, ymax: number}, results: [{x: Date, y: number}]}}
 */
const yTransformData = ({ data, yTransformation = (d) => d }) => {
  const results = [];
  const range = new DataRange(true);
  data.forEach((item) => {
    let x = item.date;
    let y = yTransformation(item.value);
    range.update({ x, y });
    results.push({ x, y });
  });
  return { range: range.get(), results };
};

/**
 * transform numMonths in a line data set
 */
const getMonth = ({ numMonths = 1 }) => {
  if (typeof numMonths !== "number")
    throw new Error("input numMonths is not a number");
  return numMonths + " month";
};

/**
 * get contribution of category (within given extension days today inclusive ahead of time) to target option
 * targetData must have same optionIds
 *  @param {{targetData: [{optionId: number, value: number, date: Date}], categoryData: [{date: Date, optionIds: [number], optionNames: [string]}], extension: number}}
 * @return {{optionName: number}}
 */
const getContributionCounts = ({ targetData, categoryData, extension }) => {
  const counts = {};
  let start = 0;
  const extensionMilliseconds = 24 * 60 * 60 * 1000 * extension;
  targetData.forEach((target) => {
    while (
      //skip all data father than extension ahead of target
      categoryData[start] &&
      categoryData[start].date <= target.date - extensionMilliseconds
    )
      start++;
    for (
      // for all data up to date of target
      let i = start;
      categoryData[i] && categoryData[i].date <= target.date;
      i++
    ) {
      for (let optionName of categoryData[i].optionNames) {
        if (!counts[optionName]) counts[optionName] = 0;
        counts[optionName]++;
      }
      start++;
    }
  });
  return { counts };
};

/**
 * get contribution of category (within given extension days today inclusive ahead of time) to target option
 * targetData must have same optionIds
 * @param {{optionName: number}}
 * @return {[{x: number, y: number}]}
 */
const getSortedPercentageCounts = ({ counts }) => {
  if (Object.keys(counts).length !== 0) {
    let sum = Object.values(counts).reduce((total, d) => total + d);
    const results = Object.entries(counts).map((e) => ({
      x: e[0],
      y: Math.round((e[1] / sum) * 100),
    }));
    results.sort((d1, d2) => -d1.y + d2.y);
    return results;
  } else return [];
};

module.exports = {
  DataRange,
  aggregateData,
  yTransformData,
  getMonth,
  getContributionCounts,
  getSortedPercentageCounts,
};
