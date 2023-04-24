// @ts-check
'use strict'
const validate = require('./validate.js');
const pg = require('./pg.js');

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());

app.get('/api/delivery', async function(req, res, next) {
  console.log('Starting request on GET for route /api/delivery');
  // validate
  console.log('Validating request...');
  let searchParams;
  try {
    searchParams = validate.delivery(req.query);
    if(searchParams.error ?? false) {
      throw searchParams.error;
    }
  } catch(errorValidatingPayload) {
    // TODO - send to logger
    console.error('Error validating payload');
    console.error(errorValidatingPayload);
    next(createError(400, 'Invalid request'));
    return;
  }
  console.log('Done!');

  // get data from DB
  console.log('Sending delivery to DB...');
  let result;
  try {
    result = await pg.delivery.select(searchParams);
  } catch(errorGettingDeliveryData) {
    // TODO - send to logger
    console.log('Error getting data from DB');
    console.log(errorGettingDeliveryData);
    next();
    return;
  }
  console.log('Done!');
  
  res.send(result.rows);
});

app.listen(3000);
console.log('Express started on port 3000...');
