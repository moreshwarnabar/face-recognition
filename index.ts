import { S3Event } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';

const s3 = new S3Client({ region: 'us-east-1', logger: undefined });

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

  try {
    // fetch the video from the bucket
    const response = await s3.send(new GetObjectCommand(params));
    console.log('Writing video to file');
    const body = await response.Body?.transformToString();
    if (body != undefined) {
      console.log('Body is present');
      await writeFile(`/tmp/${key}`, body);
    }

    if (fs.existsSync(`/tmp/${key}`)) {
      console.log('File exists');
      return 'Completed successfully!';
    }
    return 'Completed unsuccessfully!';
  } catch (err) {
    console.log(err);
    const message = `Error fetching video ${key} from bucket ${bucket}`;
    console.log(message);
    throw new Error(message);
  }
};
