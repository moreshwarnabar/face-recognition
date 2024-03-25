import { S3Event } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import { createDirectory } from './src/createDir';
import internal from 'stream';

const s3 = new S3Client({ region: 'us-east-1' });

export const handler = async (event: S3Event): Promise<String | undefined> => {
  // extract the required parameters from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, '')
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };
  console.log(`KEY: ${params.Key}`);

  createDirectory('videos');

  try {
    // fetch the video from the bucket
    const response = await s3.send(new GetObjectCommand(params));
    const fileStream = fs.createWriteStream('videos/');
    if (response.Body instanceof internal.Readable) {
      response.Body.pipe(fileStream);
    } else {
      console.log(
        `GetObjectCommand should return an internal.Readable object. Maybe the code is running in the Browser?`
      );
    }
    return 'Completed successfully!';
  } catch (err) {
    console.log(err);
    const message = `Error fetching video ${key} from bucket ${bucket}`;
    console.log(message);
    throw new Error(message);
  }
};
