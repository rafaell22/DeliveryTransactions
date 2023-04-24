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
 * Insert bonus data into DB
 * @param {Object} data - bonus data to be inserted
 * @param {string} data.bonusId - Type uuid
 * @param {string} data.deliveryId - Type uuid
 * @param {string} data.modifiedTimestamp - IsoString
 * @param {number} data.value - value earned by the bonus
 */
async function insert(data) {
  console.log('Building query...');
  const query = `
    INSERT INTO
        sc_courier_transactions.tb_bonuses
      VALUES
        ($1, $2, $3, $4)
      ON CONFLICT("bonusId") 
        -- there could be situations when a queue sends the same message multiple times
        DO NOTHING;
    ;
  `;

  const params = [
    data.bonusId,
    data.deliveryId,
    data.modifiedTimestamp,
    data.value,
  ]
  console.log('Done!');

  console.log('Sending query...');
  try {
    await pool.query(query, params);
  } catch(errorInsertingBonus) {
    throw errorInsertingBonus;
  }
  console.log('Done!')
}

module.exports = {
  bonus: {
    insert,
  },
};
