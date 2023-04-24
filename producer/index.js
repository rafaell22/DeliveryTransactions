//@ts-check
import {PublishCommand} from '@aws-sdk/client-sns';
import * as dotenv from 'dotenv';
dotenv.config();

import { snsClient } from "./libraries/snsClient.js";

// message
const params = {
  Message: JSON.stringify({
      deliveryId: '123',
      courierId: '456',
      createdTimestamp: (new Date()).toISOString(),
      value: '20',
  }),
  TopicArn: process.env.TOPIC_DELIVERY_CREATED,
};

// run async/await in auto-executable function
(async () => {
  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log('Success: ', data);
    return data;
  } catch(err) {
    console.log('Error', err.stack);
  }
})()
