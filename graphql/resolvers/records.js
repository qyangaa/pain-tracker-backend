const {
  updateWeather,
  uploadRecords,
  updateLastUsed,
  getUserRecordsByOptionId,
  getUserRecordsOptions,
  getUserRecordsCategory,
  getUserRecordsCategoryDayTotal,
  getUserRecordsCategoryDayOptions,
  getCategoryById,
} = require("../../postgres/queries");

const popular = {
  1: [16, 17],
  2: [18, 19, 20, 21],
  3: [22, 23, 24, 25],
};

exports.createRecords = async (args, req) => {
  try {
    const date = new Date();
    if (args.geoCoordinates) {
      await updateWeather(args.geoCoordinates, date, req.uid);
    }

    let records = args.records.filter((record) => record.selected);
    const lastUsed = {
      options: [],
      categories: [],
      selected: [],
      duration: [],
      amount: [],
      _id: req.uid,
    };
    const category2Options = {};

    records.forEach((record) => {
      lastUsed.options.push(parseInt(record._id));
      categoryId = parseInt(record.categoryId);
      lastUsed.categories.push(categoryId);
      if (!category2Options[categoryId])
        category2Options[categoryId] = new Set();
      category2Options[categoryId].add(parseInt(record._id));

      lastUsed.selected.push(true);
      lastUsed.duration.push(parseInt(record.duration) ? record.duration : 0);
      lastUsed.amount.push(parseInt(record.amount) ? record.amount : 0);
    });

    for (const [categoryId, options] of Object.entries(category2Options)) {
      if (options.length >= 4) continue;
      for (let id of popular[categoryId]) {
        if (options.has(id)) continue;
        options.add(id);
        lastUsed.options.push(id);
        lastUsed.categories.push(categoryId);
        lastUsed.selected.push(false);
        lastUsed.duration.push(0);
        lastUsed.amount.push(0);
        if (options.length >= 4) break;
      }
    }
    await uploadRecords(req.uid, records);
    await updateLastUsed(req.uid, lastUsed);
  } catch (error) {
    return error;
  }
};

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

exports.getPainDayData = async (args, req) => {
  try {
    const data = await getUserRecordsOptions(
      req.uid,
      [16, 17],
      args.numMonths + " month"
    );
    let painLevel = 0;
    const results = [];
    const range = new DataRange();
    data.forEach((item) => {
      if (item.option_id === 16) painLevel--;
      else painLevel++;
      if (
        results.length &&
        results[results.length - 1].date &&
        results[results.length - 1].date.toDateString() ==
          item.date.toDateString()
      )
        results.pop();
      let x = item.date;
      let y = painLevel;
      range.update({ x, y });
      results.push({ x, y });
    });
    const series = {
      xlabel: "date",
      ylabel: "pain level",
      ...range.get(),
      data: results,
    };
    // console.log(results);
    // console.log(series);
    return { title: "Trend of my pain level", seriesData: [series] };
  } catch (error) {
    throw error;
  }
};

exports.getDailyTotal = async (args, req) => {
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
      let y = (item[args.type] / 60).toFixed(1);
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
      title: `Everyday ${args.categoryName} ${args.type} (hrs)`,
      seriesData: [series],
    };
  } catch (error) {
    throw error;
  }
};

exports.getContribution = async (args, req) => {
  try {
    const targetData = await getUserRecordsOptions(
      req.uid,
      [args.optionId],
      args.numMonths + " month"
    );
    const categoryData = await getUserRecordsCategoryDayOptions(
      req.uid,
      args.categoryId,
      args.numMonths + " month"
    );

    // console.log({ targetData, categoryData });
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
        for (let optionName of categoryData[i].option_name) {
          if (!hashMap[optionName]) hashMap[optionName] = 0;
          hashMap[optionName]++;
        }
      }
    });
    const series = { xlabel: "item", ylabel: "count", data: [] };
    if (Object.keys(hashMap).length !== 0) {
      let sum = Object.values(hashMap).reduce((total, d) => total + d);
      const results = Object.entries(hashMap).map((e) => ({
        x: e[0],
        y: Math.round((e[1] / sum) * 100),
      }));
      results.sort((d1, d2) => -d1.y + d2.y);
      console.log(results);
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

exports.getRecords = async (args, req) => {
  try {
    const results = await getUserRecordsByOptionId(
      req.uid,
      16,
      args.numMonths + " month"
    );
    // console.log({ results });
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getRecordsTemplate = async (args, req) => {
  try {
    const results = await getRecordsByUser(req.uid, args.numMonths + " month");
    // console.log({ results });
    return true;
  } catch (error) {
    throw error;
  }
};
