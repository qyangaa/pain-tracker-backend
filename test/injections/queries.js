exports.updateWeather = ({ geoCoordinates, date, uid }) => {
  if (!geoCoordinates || !geoCoordinates.lat || !geoCoordinates.lon)
    throw new Error(
      "missing or incorrect formate for argument 'geoCoordinates'"
    );
  if (!date) throw new Error("missing argument 'date'");
  if (!uid) throw new Error("missing argument 'uid'");
  return true;
};

exports.uploadRecords = ({ uid, records, date }) => {
  if (!records || !records[0]) throw new Error("missing 'records'");
  if (
    !records[0].optionId ||
    !records[0].categoryId ||
    !records[0].selected ||
    !records[0].value
  )
    throw new Error("missing record fields");
  if (!uid) throw new Error("missing argument 'uid'");
  if (!date) throw new Error("missing argument 'date'");
  return true;
};

exports.updateLastUsed = ({ uid, lastUsed }) => {
  if (!uid) throw new Error("missing argument 'uid'");
  if (!lastUsed) throw new Error("missing argument 'lastUsed'");
  if (!lastUsed.options || !lastUsed.selected || !lastUsed.value)
    throw new Error("missing last used fields");
  return true;
};
