// @ts-check
'use strict'
const Joi = require('joi');

/**
 * Validate the content of the search parameters (valid JSON and fields)
 * @param {Object} search - parameters to be validated
 * @param {string} search.from - start datetime
 * @param {string} search.to - to datetime
 * @return {Object} - the search parameters themselves (the delivery data)
 */
function delivery(search) {
  const schema = Joi.object({
    from: Joi.string().isoDate().required(),
    to: Joi.string().isoDate().required(),
    courier: Joi.string().uuid({version: ['uuidv4']}),
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
