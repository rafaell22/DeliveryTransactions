// @ts-check
import * as dotenv from 'dotenv';
dotenv.config();

import { SQSClient } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ 
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  }
});

export { sqsClient };
