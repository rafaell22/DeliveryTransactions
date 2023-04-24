// @ts-check
import * as dotenv from 'dotenv';
dotenv.config();

import { SNSClient } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ 
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  }
});

export { snsClient };
