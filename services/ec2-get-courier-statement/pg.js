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
 * Get courier-statement data from DB
 * @param {Object} search - parameters used to build the courier statement
 * @param {string} search.courierId - Type uuid
 * @param {string} search.from - IsoString
 * @param {string} search.to - IsoString
 */
async function select(search) {
  console.log('Building query...');
  const query = `
    SELECT
		"courierId",
        SUM(deliveries."value") AS "totalDeliveries",
		SUM("totalAdjustments") AS "totalAdjustments",
		SUM("totalBonuses") AS "totalBonuses",
		SUM(deliveries."value") + COALESCE(SUM("totalAdjustments"), 0) + COALESCE(SUM("totalBonuses"), 0) AS "totalValue"
      FROM
        sc_courier_transactions.tb_deliveries deliveries
      LEFT JOIN
      (
        SELECT
            "deliveryId",
            SUM("value") AS "totalAdjustments"
          FROM
            sc_courier_transactions.tb_adjustments
          GROUP BY
            "deliveryId"
      ) adjustments ON
        deliveries."deliveryId" = adjustments."deliveryId"
      LEFT JOIN
      (
        SELECT
            "deliveryId",
            SUM("value") AS "totalBonuses"
          FROM
            sc_courier_transactions.tb_bonuses
          GROUP BY
            "deliveryId"
      ) bonuses ON
        deliveries."deliveryId" = bonuses."deliveryId"
    WHERE
        "courierId" = $1
        deliveries."createdTimestamp" BETWEEN $2 AND $3
	GROUP BY
		"courierId";
  `;

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
  courierStatement: {
    select,
  },
};
