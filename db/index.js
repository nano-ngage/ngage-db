var pg = require('pg');

var config = {
  user: 'ephqygbj', //env var: PGUSER
  database: 'ephqygbj', //env var: PGDATABASE
  password: 'sTgEHTHK82B7Rc9WVZ92y8PEcAKkm8zh', //env var: PGPASSWORD
  host: 'babar.elephantsql.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

module.exports = pool;