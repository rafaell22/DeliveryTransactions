// @ts-check
import { ReceiveMessageCommand, ListQueuesCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./libraries/sqsClient.js";
import * as dotenv from 'dotenv';
dotenv.config();

const payload = {
  QueueUrl: process.env.QUEUE_URL,
  AttributeNames: [
    'SenderId', 
    'SentTimeStamp', // for possible logging
    'SequenceNumber', // for possible logging
  ],
  MaxNumberOfMessages: 1, // for the sake of this consumer (testing the messaging queue), 1 is enough
  VisibilityTimeout: 10,
  WaitTimeSeconds: 10,
};

const command = new ReceiveMessageCommand(payload);
// const command = new ListQueuesCommand();
(async () => {
  let response;
  try {
    response = await sqsClient.send(command);
    console.log('Response: ')
    console.log(response);
    console.log('Message content: ', response.Messages?.map(msg => {
      let body;
      try {
        if(typeof msg.Body !== 'string') {
          throw new Error(`msg.Body is of type ${typeof msg.Body}`);
        }
        body = JSON.parse(msg.Body);
      } catch(errorParsingMessageBody) {
        throw errorParsingMessageBody;
      }
      const topicArn = body.TopicArn;
      const content = JSON.parse(body.Message);

      return {
        topic: topicArn,
        message: content,
      }
    }));
  } catch(errorReceiveingMessage) {
    console.error('Error Retrieving messages: ');
    console.error(errorReceiveingMessage);
  }
})()
