exports.checkParametersCategory = ({ uid, categoryId, numMonths }) => {
  if (!uid) throw new Error("missing argument 'uid'");
  if (!categoryId) throw new Error("missing argument 'categoryId'");
  if (!numMonths) throw new Error("missing argument 'numMonths'");
};

exports.checkParametersOptions = ({ uid, optionIds, numMonths }) => {
  if (!uid) throw new Error("missing argument 'uid'");
  if (!optionIds) throw new Error("missing argument 'categoryId'");
  if (!numMonths) throw new Error("missing argument 'numMonths'");
};
