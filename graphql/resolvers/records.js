const {
  updateWeather,
  uploadRecords,
  updateLastUsed,
  getUserRecordsByOptionId,
  getUserRecordsOptions,
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

exports.getPainDayData = async (args, req) => {
  try {
    const data = await getUserRecordsOptions(
      req.uid,
      [16, 17],
      args.numMonths + " month"
    );
    let painLevel = 0;
    const results = [];
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

      results.push({ x: item.date, y: painLevel });
    });
    const series = { xlabel: "date", ylabel: "pain level", data: results };
    return { title: "Trend of my pain level", seriesData: [series] };
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
    console.log({ results });
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getRecordsTemplate = async (args, req) => {
  try {
    const results = await getRecordsByUser(req.uid, args.numMonths + " month");
    console.log({ results });
    return true;
  } catch (error) {
    throw error;
  }
};
