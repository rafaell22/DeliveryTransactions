//@ts-check
'use strict'
const dotenv = require('dotenv');
dotenv.config();

const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? '',
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE ?? '',
  user: process.env.POSTGRES_USER ?? '',
  password: process.env.POSTGRES_PASSWORD ?? '',
  query_timeout: 1000 * 10,
  connectionTimeoutMillis: 1000 * 30,
  idle_in_transaction_session_timeout: 1000 * 30,
});

pool.on('error', (errorPgClient) => {
  console.log('Client error!');
  console.log(errorPgClient);
});

/**
 * Get delivery data from DB
 * @param {Object} search - delivery data to be inserted
 * @param {string} search.courierId - Type uuid
 * @param {string} search.from - IsoString
 * @param {string} search.to - IsoString
 */
async function select(search) {
  console.log('Building query...');
  const query = `
    SELECT
        "deliveryId",
        "courierId",
        "createdTimestamp",
        "value"
      FROM
        sc_courier_transactions.tb_deliveries
      WHERE
        "courierId" = $1 AND
        "createdTimestamp" BETWEEN $2 AND $3
  ;`;

  const params = [
    search.courierId,
    search.from,
    search.to,
  ]
  console.log('Done!');

  console.log('Sending query...');
  let result;
  try {
    result = await pool.query(query, params);
  } catch(errorGettingDeliveries) {
    throw errorGettingDeliveries;
  }
  console.log('Done!')

  return result;
}

module.exports = {
  delivery: {
    select,
  },
};
