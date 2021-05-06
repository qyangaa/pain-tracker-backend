/**
 * Default {categoryId: [optionId]} to populate user added category for first time
 * @TODO write function to record popular selections
 */
const popular = {
  1: [16, 17],
  2: [18, 19, 20, 21],
  3: [22, 23, 24, 25],
};

/**
 * Create lastUsed entry using raw records input
 *  @Note record.selected should always be true
 * @param {{records: [{optionId: number, categoryId: number, selected: boolean, value: number}], uid: number}}
 * @return {{lastUsed: {options: number, selected: boolean, value: number, uid: number}}}
 */
exports.createLastUsedEntry = ({
  records,
  uid,
  _populateLastUsed = this.populateLastUsed,
  _fillLastUsedToLength = this.fillLastUsedToLength,
}) => {
  const lastUsed = {
    options: [],
    selected: [],
    value: [],
    uid,
  };
  const category2Options = _populateLastUsed({ records, lastUsed });
  _fillLastUsedToLength({ lastUsed, category2Options, length: 4 });
  return lastUsed;
};

/**
 * Populate lastUsed and create {category: Set<optionId>]} map
 *  @Note record.selected should always be true
 * @param {{records: [{optionId: number, categoryId: number, selected: boolean, value: number}], lastUsed: {options: number, selected: boolean, value: number, uid: number}}}
 * @return {{categoryId: Set<number>]}}
 */
exports.populateLastUsed = ({ records, lastUsed }) => {
  const category2Options = {};
  records.forEach((record) => {
    lastUsed.options.push(record.optionId);
    const categoryId = record.categoryId;
    if (!category2Options[categoryId]) category2Options[categoryId] = new Set();
    category2Options[categoryId].add(record.optionId);
    lastUsed.selected.push(true);
    lastUsed.value.push(record.value ? record.value : 0);
  });
  return category2Options;
};

/**
 * Fill last used to fixed length
 * @param {{category2Options: {categoryId: Set<number>]}, length: number, lastUsed: {options: number, selected: boolean, value: number, uid: number}}}
 */
exports.fillLastUsedToLength = ({ lastUsed, length, category2Options }) => {
  for (const [categoryId, options] of Object.entries(category2Options)) {
    if (options.length >= length) continue;
    for (let id of popular[categoryId]) {
      if (options.has(id)) continue;
      options.add(id);
      lastUsed.options.push(id);
      lastUsed.selected.push(false);
      lastUsed.value.push(0);
      if (options.length >= length) break;
    }
  }
};
