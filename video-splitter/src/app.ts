import { S3Event } from 'aws-lambda';
import { downloadVideo, uploadFrames } from './service/s3Service';
import { videoSplitter } from './utils/splitter';
import fs from 'node:fs';

export const handler = async (event: S3Event): Promise<String | undefined> => {
  fs.access(`/tmp`, fs.constants.F_OK, err => {
    if (err) console.log('Saved video not found', err);
    else console.log('Found the saved video');
  });
  // extract the required parameters from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, '')
  );
  console.log(`VIDEO: ${key}`);
  // download the video
  const result = await downloadVideo(bucket, key);
  // extract the frames from the video
  await videoSplitter(key);
  // upload frames to s3 out bucket
  const uploadResult = await uploadFrames(key.split('.')[0]);
  return result;
};
