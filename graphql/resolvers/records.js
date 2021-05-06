const queries = require("../../postgres/queries");

const recordUtils = require("./utils/recordUtils");

/**
 * Upload record to database
 * @param {{args: {records: [{optionId: number, categoryId: number, selected: boolean, value: number}]} }}
 * @return {{Boolean}}
 */
exports.createRecords = async (
  args,
  req,
  utils = recordUtils,
  _queries = queries
) => {
  try {
    const date = new Date();
    if (args.geoCoordinates) {
      await _queries.updateWeather({
        geoCoordinates: args.geoCoordinates,
        date,
        uid: req.uid,
      });
    }

    let records = args.records.filter((record) => record.selected);
    const lastUsed = utils.createLastUsedEntry({ records, uid: req.uid });
    await _queries.uploadRecords({ uid: req.uid, records, date });
    await _queries.updateLastUsed({ uid: req.uid, lastUsed });
  } catch (error) {
    return error;
  }
};
