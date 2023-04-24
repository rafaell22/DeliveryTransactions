// @ts-check
'use strict'
const validate = require('./validate.js');
const pg = require('./pg.js');

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/bonus', async function(req, res, next) {
  console.log('Starting request on GET route /api/bonus');
  // validate
  console.log('Validating bonus...');
  let data;
  try {
    data = validate.bonus(req.body);
    if(data.error ?? false) {
      throw data.error;
    }
  } catch(errorValidatingPayload) {
    // TODO - send to logger
    console.error('Error validating payload');
    console.error(errorValidatingPayload);
    next(createError(400, 'Invalid request'));
    return;
  }
  console.log('Done!');

  // insert into DB
  console.log('Sending bonus to DB...');
  try {
    await pg.bonus.insert(data);
  } catch(errorInsertingBonus) {
    // TODO - send to logger
    console.log('Error inserting data in DB');
    console.log(errorInsertingBonus);
    next();
    return;
  }
  console.log('Done!');
  
  res.send('OK');
});

app.listen(3000);
console.log('Express started on port 3000...');
