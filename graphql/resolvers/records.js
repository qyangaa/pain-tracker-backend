const {
  updateWeather,
  uploadRecords,
  updateLastUsed,
} = require("../../postgres/queries");

exports.createRecords = async (args, req) => {
  try {
    req.uid = 1;
    const date = new Date();
    if (args.geoCoordinates) {
      await updateWeather(args.geoCoordinates, date, req.uid);
    }

    let records = args.records.filter((record) => record.selected);
    const lastUsed = {
      options: [],
      selected: [],
      duration: [],
      amount: [],
      _id: req.uid,
    };
    records.forEach((record) => {
      lastUsed.options.push(parseInt(record._id));
      lastUsed.selected.push(true);
      lastUsed.duration.push(parseInt(record.duration) ? record.duration : 0);
      lastUsed.amount.push(parseInt(record.amount) ? record.amount : 0);
    });
    if (lastUsed.options.length < 4) {
      args.records
        .filter((record) => !record.selected)
        .forEach((record) => {
          lastUsed.options.push(record._id);
          lastUsed.selected.push(false);
          lastUsed.duration.push(record.duration);
          lastUsed.amount.push(record.amount);
        });
      lastUsed.options = lastUsed.options.slice(0, 4);
      lastUsed.selected = lastUsed.selected.slice(0, 4);
      lastUsed.duration = lastUsed.duration.slice(0, 4);
      lastUsed.amount = lastUsed.amount.slice(0, 4);
    }
    await uploadRecords(req.uid, records);
    await updateLastUsed(req.uid, lastUsed);
  } catch (error) {
    return error;
  }
};

// TODO: upload record to mongodb
