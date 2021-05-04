const { db, pgp } = require("./db");
const fetch = require("node-fetch");
const math = require("mathjs");
const DataLoader = require("dataloader");

const defualtNumMonths = "1 month";

exports.getUid = async ({ authId }) => {
  try {
    const results = await db.query(
      `SELECT user_id 
  FROM users WHERE auth_id = $1`,
      [authId]
    );
    return results[0].user_id;
  } catch (error) {
    throw error;
  }
};

exports.categoriesLoader = async ({ categoryIds }) => {
  try {
    const results = await db.query(
      `SELECT category_id AS _id,
      short_name AS name,
      TRIM (title) AS Title
      FROM categories WHERE category_id = ANY($1::int[])`,
      [categoryIds]
    );

    return results;
  } catch (error) {
    throw error;
  }
};

exports.getCategoryById = async ({ categoryId }) => {
  try {
    const results = await db.query(
      `SELECT category_id AS _id,
      short_name AS name,
      TRIM (title) AS Title,
      is_contributor AS "isContributor"
  FROM categories WHERE category_id = $1`,
      [categoryId]
    );
    return results[0];
  } catch (error) {
    throw error;
  }
};

exports.optionsLoader = async ({ optionIds }) => {
  try {
    const results = await db.any(
      `SELECT p.option_id AS _id, 
      p.category_id AS "categoryId", 
      TRIM (p.title) AS title, 
      p.defualt_value as "defaultValue", 
      p.icon_name
      FROM options p 
      WHERE p.option_id = ANY($1::int[])
      ;`,
      [optionIds]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getLastUsed = async ({ uid }) => {
  try {
    const results = await db.query(
      `SELECT options, 
      selected, 
      value
      FROM last_useds WHERE user_id = $1`,
      [uid]
    );
    const row = results;
    return row[0];
  } catch (error) {
    throw error;
  }
};

exports.updateWeather = async ({ geoCoordinates, date, uid }) => {
  try {
    const { lon, lat } = geoCoordinates;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER}`;
    const res = await fetch(weatherUrl);
    const raw = await res.json();
    const results = await db.query(
      `INSERT INTO weathers(
        user_id,
        date_,
        lon ,
        lat,
        main,
        description_,
        temp,
        humidity ,
        pressure ,
        clouds,
        visibility,
        wind_speed) VALUES (
          $1,
          $2,
          $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12
        );`,
      [
        uid,
        date,
        lon,
        lat,
        raw.weather[0].main,
        raw.weather[0].description,
        math.round(raw.main.temp),
        math.round(raw.main.humidity),
        math.round(raw.main.pressure),
        math.round(raw.clouds.all),
        math.round(raw.visibility),
        math.round(raw.wind.speed),
      ]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

exports.uploadRecords = async ({ uid, records, date }) => {
  try {
    const cs = new pgp.helpers.ColumnSet(
      ["user_id", "option_id", "category_id", "value", "date"],
      { table: "records" }
    );
    const values = records.map((record) => ({
      option_id: record._id,
      user_id: uid,
      category_id: record.categoryId,
      value: record.value,
      date,
    }));
    const query = pgp.helpers.insert(values, cs);
    await db.none(query);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getLastUploadedRecords = async ({ uid, count }) => {
  try {
    const results = await db.query(
      `select option_id as "_id",
      category_id as "categoryId",
      value
      from records WHERE user_id = $1  ORDER BY record_id DESC LIMIT $2`,
      [uid, count]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.updateLastUsed = async ({ uid, lastUsed }) => {
  try {
    const csLastUsed = new pgp.helpers.ColumnSet(
      ["options", "selected", "value"],
      { table: "last_useds" }
    );
    const condition = pgp.as.format("WHERE user_id = $1", uid);
    const query = pgp.helpers.update(lastUsed, csLastUsed) + condition;
    await db.none(query);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.searchOptionQuery = async ({ text, categoryId }) => {
  const tsquery = text.split(" ").join("|");
  try {
    const results = await db.any(
      `SELECT p.option_id AS _id, 
      p.category_id AS "categoryId", 
      TRIM (p.title) AS title, 
      p.duration, 
      p.amount,
      p.icon_name
      FROM options p 
        WHERE p.category_id = $1 AND vector_field @@ to_tsquery($2)
        ;`,
      [parseInt(categoryId), tsquery]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.deleteUserRecords = async ({ uid }) => {
  try {
    const results = await db.any(
      `
      DELETE FROM records
      WHERE user_id = $1
      ;`,
      [uid]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getUserRecordsByOptions = async ({
  uid,
  optionIds,
  numMonths = defualtNumMonths,
}) => {
  try {
    const results = await db.any(
      `
      SELECT option_id as "optionId",
      value,
      date
      FROM records
      WHERE user_id = $1
      AND option_id = ANY($2::int[])
      AND date >=CURRENT_DATE - INTERVAL $3
      ORDER BY date ASC;
      ;`,
      [uid, optionIds, numMonths]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

/**
 * Returns list of date and sum of values of records with given categoryId within numMonths
 * @function
 * @param {*} inputArg
 * @returns {[{date: Date, value: Number}]}
 */
exports.getUserRecordsByCategoryDayTotal = async ({
  uid,
  categoryId,
  numMonths = defualtNumMonths,
}) => {
  try {
    const results = await db.any(
      `
      SELECT date, SUM(value) AS value
      FROM records
      WHERE user_id = $1
      AND category_id = $2
      AND date >=CURRENT_DATE - INTERVAL $3
      GROUP BY date
      ORDER BY date ASC;
      ;`,
      [uid, categoryId, numMonths]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

/**
 * Returns list of optionIds and names of records with given categoryId within numMonths
 * @function
 * @param {*} inputArg
 * @returns {[{date: Date, optionIds: [Number], optionName: [String]}]}
 */
exports.getUserRecordsByCategoryDayOptions = async ({
  uid,
  categoryId,
  numMonths = defualtNumMonths,
}) => {
  try {
    const results = await db.any(
      `
      SELECT date, array_agg(records.option_id) as "optionIds", array_agg(title) as "optionName"
      FROM records LEFT JOIN options ON(records.option_id = options.option_id)
      WHERE user_id = $1
      AND records.category_id = $2
      AND date >=CURRENT_DATE - INTERVAL $3
      GROUP BY date
      ORDER BY date ASC;
      ;`,
      [uid, categoryId, numMonths]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getContributorCategories = async () => {
  try {
    const results = await db.query(
      `SELECT category_id AS "_id", short_name AS "name"
  FROM categories WHERE is_contributor`,
      []
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getContributeeOptions = async () => {
  try {
    const results = await db.query(
      `SELECT option_id AS "_id", options.title AS "name"
      FROM options 
      WHERE is_contributee`,
      []
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getPositivity = async ({ categoryId }) => {
  try {
    const positives = await db.query(
      `SELECT option_id FROM options where positive and category_id = $1`,
      [categoryId]
    );
    const negatives = await db.query(
      `SELECT option_id FROM options where not positive and category_id = $1`,
      [categoryId]
    );
    return {
      positives: new Set(positives.map((d) => d.option_id)),
      negatives: new Set(negatives.map((d) => d.option_id)),
    };
  } catch (error) {
    throw error;
  }
};
