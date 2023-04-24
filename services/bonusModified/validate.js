// @ts-check
'use strict'
const Joi = require('joi');

/**
 * Validate the content of the message (valid JSON and fields)
 * @param {string} body - message to be validated
 * @return {Object} - the message content (the bonus data)
 */
function bonus(body) {
  // parse content
  let parsedBody = body;
  try {
    if(typeof body === 'string') {
      parsedBody = JSON.parse(body);
    }
  } catch(errorParsingBody) {
    throw errorParsingBody;
  }

  const joiUuid = Joi.string().uuid({version:['uuidv4']});
  const schema = Joi.object({
    bonusId: joiUuid.required(),
    deliveryId: joiUuid.required(),
    modifiedTimestamp: Joi.string().isoDate().required(),
    value: Joi.number().required(),
  });

  const validatedPayload = schema.validate(parsedBody);
  if(validatedPayload.error ?? false) {
    throw validatedPayload.error;
    return;
  }

  return validatedPayload.value;
};
  

module.exports = {
  bonus,
};
