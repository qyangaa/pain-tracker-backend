exports.createLastUsedEntry = ({ records, uid }) => {
  if (!records) throw new Error("missing argument 'records'");
  if (!uid) throw new Error("missing argument 'uid'");
  return {
    options: [16, 18, 19, 22, 17, 20, 21, 23, 24, 25],
    selected: [
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    value: [0, 0, 0, 30, 0, 0, 0, 0, 0, 0],
    uid: 1,
  };
};
