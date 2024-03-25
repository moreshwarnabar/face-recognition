import { S3Event } from 'aws-lambda';
import { downloadVideo } from './service/s3Service';
import { videoSplitter } from './utils/splitter';

export const handler = async (event: S3Event): Promise<String | undefined> => {
  // extract the required parameters from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, '')
  );
  console.log(`VIDEO: ${key}`);
  // download the video
  const result = await downloadVideo(bucket, key);
  // extract the frames from the video
  await videoSplitter(`/tmp/${key}`);
  return result;
};
