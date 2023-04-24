// @ts-check
'use strict'
const Joi = require('joi');

/**
 * Validate the content of the search parameters for the previous weekly period
 * @param {Object} search - parameters to be validated
 * @param {string} [search.courierId] - courier identification
 * @return {Object} - the search parameters
 */
function courierStatement(search) {
  const schema = Joi.object({
    courierId: Joi.string().uuid({version: ['uuidv4']}).optional(),
  });

  const validatedPayload = schema.validate(search);
  if(validatedPayload.error ?? false) {
    throw validatedPayload.error;
    return;
  }

  return validatedPayload.value;
};

/**
 * Validate the content of the search parameters
 * @param {Object} search - parameters to be validated
 * @param {string} [search.courierId] - courier identification
 * @param {string} [search.from] - start datetime
 * @param {string} [search.to] - to datetime
 * @return {Object} - the search parameters themselves (the delivery data)
 */
function courierStatement(search) {
  const schema = Joi.object({
    courierId: Joi.string().uuid({version: ['uuidv4']}).optional(),
    from: Joi.string().isoDate().required(),
    to: Joi.string().isoDate().required(),
  });

  const validatedPayload = schema.validate(search);
  if(validatedPayload.error ?? false) {
    throw validatedPayload.error;
    return;
  }

  return validatedPayload.value;
};
  

module.exports = {
  courierStatement,
};
