const {
  getUid,
  updateWeather,
  uploadRecords,
  updateLastUsed,
  getUserRecordsByOptions,
  getUserRecordsCategoryDayOptions,
  getContributorCategories,
  getContributeeOptions,
} = require("../../postgres/queries");

const lineCharts = require("./charts/lineCharts.js");

const lineTypes = {
  PAIN_LEVEL: "pain level",
  EXERCISE_DURATION: "exercise duration",
  MOOD_LEVEL: "mood level",
};

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
      value: [],
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
      lastUsed.value.push(parseInt(record.value) ? record.value : 0);
    });

    for (const [categoryId, options] of Object.entries(category2Options)) {
      if (options.length >= 4) continue;
      for (let id of popular[categoryId]) {
        if (options.has(id)) continue;
        options.add(id);
        lastUsed.options.push(id);
        lastUsed.categories.push(categoryId);
        lastUsed.selected.push(false);
        lastUsed.value.push(0);
        if (options.length >= 4) break;
      }
    }
    await uploadRecords(req.uid, records);
    await updateLastUsed(req.uid, lastUsed);
  } catch (error) {
    return error;
  }
};

exports.getLineChart = async (args, req) => {
  try {
    if (Object.values(lineTypes).indexOf(args.type) === -1)
      throw new Error("Invalid lineType");
    let data;
    let yTransformation;
    switch (args.type) {
      case lineTypes.PAIN_LEVEL:
        args.categoryId = 1;
        args.categoryName = "pain";
        data = await lineCharts.getAggregate(args, req);
        return data;
      case lineTypes.EXERCISE_DURATION:
        args.categoryId = 3;
        args.categoryName = "exercise";
        args.type = "duration";
        args.unit = "hrs";
        yTransformation = (d) => (d / 60).toFixed(1);
        data = await lineCharts.getDailyTotal(args, req, yTransformation);
        return data;
      case lineTypes.MOOD_LEVEL:
        args.categoryId = 2;
        args.categoryName = "mood";
        data = await lineCharts.getAggregate(args, req);
        return data;
    }
  } catch (error) {
    throw error;
  }
};

exports.getLineChartSelections = () => {
  return Object.entries(lineTypes).map(([key, value]) => ({
    id: key,
    name: value,
  }));
};

exports.getContribution = async (args, req) => {
  try {
    const targetData = await getUserRecordsByOptions(
      req.uid,
      [args.optionId],
      args.numMonths + " month"
    );
    const categoryData = await getUserRecordsCategoryDayOptions(
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
