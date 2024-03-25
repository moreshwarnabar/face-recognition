import { S3Event } from 'aws-lambda';
import { downloadVideo } from './src/s3Service';

export const handler = async (event: S3Event): Promise<String | undefined> => {
  // extract the required parameters from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, '')
  );
  console.log(`KEY: ${key}`);
  // download the video
  const result = await downloadVideo(bucket, key);
  return result;
};
