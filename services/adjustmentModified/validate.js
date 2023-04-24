// @ts-check
'use strict'
const Joi = require('joi');

/**
 * Validate the content of the message (valid JSON and fields)
 * @param {string} body - message to be validated
 * @return {Object} - the message content (the adjustment data)
 */
function adjustment(body) {
  console.log('validate/adjustment/body: ', body);
  // parse content
  let parsedBody = body;
  try {
    if(typeof body === 'string') {
      parsedBody = JSON.parse(body);
    }
  } catch(errorParsingBody) {
    throw errorParsingBody;
  }

  console.log('validate/adjustment/parsedBody: ', parsedBody);
  const joiUuid = Joi.string().uuid({version:['uuidv4']});
  const schema = Joi.object({
    adjustmentId: joiUuid.required(),
    deliveryId: joiUuid.required(),
    modifiedTimestamp: Joi.string().isoDate().required(),
    value: Joi.number().required(),
  });

  const validatedPayload = schema.validate(parsedBody);
  console.log('validate/adjustment/validatedPayload: ', validatedPayload);
  if(validatedPayload.error ?? false) {
    throw validatedPayload.error;
    return;
  }

  return validatedPayload.value;
};
  

module.exports = {
  adjustment,
};
