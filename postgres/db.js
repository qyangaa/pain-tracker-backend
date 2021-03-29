const initOptions = {
  query(e) {
    console.log(e.query);
  },
};
const pgp = require("pg-promise")(initOptions);
const dbConfig = require("../hidden/dbConfig");
const db = pgp(dbConfig);

module.exports = { db, pgp };
