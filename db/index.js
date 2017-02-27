var Pool = require('pg-pool');

var config = {
  user: process.env.DBUSER || 'ephqygbj', //env var: PGUSER
  database: process.env.DBDB || 'ephqygbj', //env var: PGDATABASE
  password: process.env.DBPW ||'sTgEHTHK82B7Rc9WVZ92y8PEcAKkm8zh', //env var: PGPASSWORD
  host: process.env.DBHOST || 'babar.elephantsql.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: process.env.DBHOST ? 100 : 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


var pool = new Pool(config);

module.exports = pool;