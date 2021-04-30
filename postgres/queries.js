const { db, pgp } = require("./db");
const fetch = require("node-fetch");
const math = require("mathjs");
const DataLoader = require("dataloader");

exports.getUid = async (authId) => {
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

exports.categoriesLoader = new DataLoader(async (categoryIds) => {
  try {
    const results = await db.query(
      `SELECT category_id AS _id,
      short_name AS name,
      TRIM (title) AS Title,
      TRIM (screen_type) AS "screenType",
      has_duration as "hasDuration",
      TRIM (background_image) as "backgroundImage"
      FROM categories WHERE category_id = ANY($1::int[])`,
      [categoryIds]
    );
    return results;
  } catch (error) {
    throw error;
  }
});

exports.optionsLoader = new DataLoader(async (optionIds) => {
  try {
    const results = await db.any(
      `SELECT p.option_id AS _id, 
      p.category_id AS "categoryId", 
      TRIM (p.title) AS title, 
      p.duration, 
      p.amount,
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
});

exports.getLastUsed = async (uid) => {
  try {
    const results = await db.query(
      `SELECT options, 
      selected, 
      duration, 
      amount 
      FROM last_useds WHERE user_id = $1`,
      [uid]
    );
    const row = results;
    return row[0];
  } catch (error) {
    throw error;
  }
};

exports.getIconSVG = async (iconId) => {
  try {
    const results = await db.query("SELECT svg FROM icons WHERE icon_id = $1", [
      iconId,
    ]);
    const row = results;
    return row[0];
  } catch (error) {
    throw error;
  }
};

exports.updateWeather = async (geoCoordinates, date, uid) => {
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

exports.uploadRecords = async (uid, records) => {
  try {
    const cs = new pgp.helpers.ColumnSet(
      ["user_id", "option_id", "category_id", "duration", "amount"],
      { table: "records" }
    );
    const values = records.map((record) => ({
      option_id: record._id,
      user_id: uid,
      category_id: record.categoryId,
      duration: record.duration,
      amount: record.amount,
    }));
    const query = pgp.helpers.insert(values, cs);
    await db.none(query);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.updateLastUsed = async (uid, lastUsed) => {
  try {
    const csLastUsed = new pgp.helpers.ColumnSet(
      ["user_id", "options", "selected", "duration", "amount"],
      { table: "last_useds" }
    );
    lastUsed.user_id = lastUsed._id;
    const condition = pgp.as.format("WHERE user_id = $1", uid);
    const query = pgp.helpers.update(lastUsed, csLastUsed) + condition;
    await db.none(query);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.searchOptionQuery = async (text, categoryId) => {
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

exports.getRecordsByUser = async (uid, from) => {
  try {
    if (!from) from = "1 month";
    const results = await db.any(
      `
      SELECT *
      FROM records
      WHERE user_id = $1
      AND date >=CURRENT_DATE - INTERVAL $2
      ORDER BY date ASC;
      ;`,
      [uid, from]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getUserRecordsByOptionId = async (uid, optionId, numMonths) => {
  try {
    if (!numMonths) numMonths = "1 month";
    const results = await db.any(
      `
      SELECT *
      FROM records
      WHERE user_id = $1
      AND option_id = $2
      AND date >=CURRENT_DATE - INTERVAL $3
      ORDER BY date ASC;
      ;`,
      [uid, optionId, numMonths]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getUserRecordsOptions = async (uid, optionIds, numMonths) => {
  try {
    if (!numMonths) numMonths = "1 month";
    const results = await db.any(
      `
      SELECT *
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

exports.getUserRecordsCategory = async (uid, categoryId, numMonths) => {
  try {
    if (!numMonths) numMonths = "1 month";
    const results = await db.any(
      `
      SELECT *
      FROM records
      WHERE user_id = $1
      AND category_id = $2
      AND date >=CURRENT_DATE - INTERVAL $3
      ORDER BY date ASC;
      ;`,
      [uid, categoryId, numMonths]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getUserRecordsCategoryDayTotal = async (
  uid,
  categoryId,
  numMonths,
  type
) => {
  try {
    if (!numMonths) numMonths = "1 month";
    const results = await db.any(
      `
      SELECT date, SUM($1:name) AS $1:name
      FROM records
      WHERE user_id = $2
      AND category_id = $3
      AND date >=CURRENT_DATE - INTERVAL $4
      GROUP BY date
      ORDER BY date ASC;
      ;`,
      [type, uid, categoryId, numMonths]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getUserRecordsCategoryDayOptions = async (
  uid,
  categoryId,
  numMonths
) => {
  try {
    if (!numMonths) numMonths = "1 month";
    const results = await db.any(
      `
      SELECT date, array_agg(records.option_id) as option_ids, array_agg(title) as option_name
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

exports.getCategoryById = async (categoryId) => {
  try {
    const results = await db.query(
      `SELECT * 
  FROM categories WHERE category_id = $1`,
      [categoryId]
    );
    return results[0];
  } catch (error) {
    throw error;
  }
};

exports.getContributorCategories = async () => {
  try {
    const results = await db.query(
      `SELECT category_id AS "id", short_name AS "name"
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
      `SELECT option_id AS "id", options.title AS "name"
      FROM options 
      WHERE is_contributee`,
      []
    );
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getPositivity = async (categoryId) => {
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
