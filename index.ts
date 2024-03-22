import { S3Event } from 'aws-lambda';
import {
  HeadBucketCommandOutput,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { videoSplitter } from './src/splitter';

const s3 = new S3Client({ region: 'us-east-1' });

export const handler = async (
  event: S3Event
): Promise<HeadBucketCommandOutput | undefined> => {
  console.log(`EVENT: ${event}`);
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, '')
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };
  console.log(`PARAMS: ${params}`);

  try {
    // fetch the video from the bucket
    const response = await s3.send(new HeadObjectCommand(params));
    console.log(`RESPONSE: ${response}`);
    return response;
  } catch (err) {
    console.log(err);
    const message = `Error fetching video ${key} from bucket ${bucket}`;
    console.log(message);
    throw new Error(message);
  }
};
