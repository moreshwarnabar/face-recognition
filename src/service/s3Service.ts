import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NodeJsRuntimeStreamingBlobPayloadOutputTypes } from '@smithy/types';
import fs from 'node:fs';
import path from 'node:path';

const s3 = new S3Client({ region: 'us-east-1', logger: undefined });

export const downloadVideo = async (
  bucket: string,
  key: string
): Promise<string | undefined> => {
  try {
    // fetch the video from the bucket
    const response = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    console.log('Writing video to file');
    const body = response.Body as NodeJsRuntimeStreamingBlobPayloadOutputTypes;
    body.pipe(fs.createWriteStream(`/tmp/${key}`));

    fs.access(`/tmp/${key}`, fs.constants.F_OK, err => {
      if (err) console.log('Saved video not found', err);
      else console.log('Found the saved video');
    });
    return 'Completed successfully!';
  } catch (err) {
    console.log(err);
    const message = `Error fetching video ${key} from bucket ${bucket}`;
    console.log(message);
    throw new Error(message);
  }
};

export const uploadFrames = async (dirName: string) => {
  const dirPath = path.join('/tmp', dirName);
  console.log(`DIR PATH: ${dirPath}`);
  fs.readdir(dirPath, (err, data) => {
    if (err) console.log(err);
    console.log(`TOTAL FILES: ${data.length}`);

    data.forEach(async file => {
      const filePath = `${dirPath}/${file}`;
      console.log(`FILEPATH: ${filePath}`);
      const input = {
        Body: fs.createReadStream(filePath),
        Bucket: '1229975385-stage-1',
        Key: `${dirName}/${file}`,
      };
      const uploadResult = await s3.send(new PutObjectCommand(input));
      console.log(`UPLOADED: ${file}`);
    });
  });
};
