// @ts-check
'use strict'
const Joi = require('joi');

/**
 * Validate the content of the search parameters 
 * @param {Object} search - parameters to be validated
 * @param {string} search.from - start datetime
 * @param {string} search.to - to datetime
 * @param {string} search.courierId - courier identification
 * @return {Object} - the search parameters
 */
function delivery(search) {
  const schema = Joi.object({
    from: Joi.string().isoDate().required(),
    to: Joi.string().isoDate().required(),
    courierId: Joi.string().uuid({version: ['uuidv4']}),
  });

  const validatedPayload = schema.validate(search);
  if(validatedPayload.error ?? false) {
    throw validatedPayload.error;
    return;
  }

  return validatedPayload.value;
};
  
module.exports = {
  delivery,
};
