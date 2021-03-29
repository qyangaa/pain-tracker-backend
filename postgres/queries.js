const pool = require("./db");
const DataLoader = require("dataloader");

exports.categoriesLoader = new DataLoader(async (categoryIds) => {
  try {
    const results = await pool.query(
      `SELECT category_id AS _id,
      short_name AS name,
      title,
      screen_type AS "screenType",
      has_duration as "hasDuration",
      background_image as "backgroundImage"
      FROM categories WHERE category_id = ANY($1::int[])`,
      [categoryIds]
    );
    return results.rows;
  } catch (error) {
    throw error;
  }
});

exports.optionsLoader = new DataLoader(async (optionIds) => {
  try {
    const results = await pool.query(
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
    return results.rows;
  } catch (error) {
    throw error;
  }
});

exports.getLastUsed = async (authId) => {
  try {
    const results = await pool.query(
      `SELECT options, 
      selected, 
      duration, 
      amount 
      FROM users, last_useds WHERE auth_id = $1`,
      [authId]
    );
    const row = results.rows;
    return row[0];
  } catch (error) {
    throw error;
  }
};

exports.getIconSVG = async (iconId) => {
  try {
    const results = await pool.query(
      "SELECT svg FROM icons WHERE icon_id = $1",
      [iconId]
    );
    const row = results.rows;
    return row[0];
  } catch (error) {
    throw error;
  }
};
