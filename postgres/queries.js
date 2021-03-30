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
    return results[0];
  } catch (error) {
    throw error;
  }
};

exports.categoriesLoader = new DataLoader(async (categoryIds) => {
  try {
    const results = await db.query(
      `SELECT category_id AS _id,
      short_name AS name,
      title,
      screen_type AS "screenType",
      has_duration as "hasDuration",
      background_image as "backgroundImage"
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
      p.title, 
      p.duration, 
      p.amount,
      i_src.svg AS src,
      i_src_active as "srcActive"
      FROM options p 
      LEFT OUTER JOIN icons i_src on p.src = i_src.icon_id
      LEFT OUTER JOIN icons i_src_active on p.src_active = i_src_active.icon_id
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
        p.title, 
        p.duration, 
        p.amount,
        i_src.svg AS src,
        i_src_active as "srcActive"
        FROM options p 
        LEFT OUTER JOIN icons i_src on p.src = i_src.icon_id
        LEFT OUTER JOIN icons i_src_active on p.src_active = i_src_active.icon_id
        WHERE p.category_id = $1 AND vector_field @@ to_tsquery($2)
        ;`,
      [parseInt(categoryId), tsquery]
    );
    return results;
  } catch (error) {
    throw error;
  }
};
