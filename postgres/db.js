const Pool = require("pg").Pool;
const dbConfig = require("../hidden/dbConfig");
const pool = new Pool(dbConfig);

module.exports = pool;
