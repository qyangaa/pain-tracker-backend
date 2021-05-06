const {
  updateWeather,
  uploadRecords,
  updateLastUsed,
} = require("../../postgres/queries");

const utils = require("./utils/recordUtils");

/**
 * Upload record to database
 * @param {{args: {records: [{optionId: number, categoryId: number, selected: boolean, value: number}]} }}
 * @return {{Boolean}}
 */
exports.createRecords = async (args, req) => {
  try {
    const date = new Date();
    if (args.geoCoordinates) {
      await updateWeather(args.geoCoordinates, date, req.uid);
    }

    let records = args.records.filter((record) => record.selected);
    const lastUsed = utils.createLastUsedEntry({ records, uid: req.uid });
    await uploadRecords(req.uid, records);
    await updateLastUsed(req.uid, lastUsed);
  } catch (error) {
    return error;
  }
};
