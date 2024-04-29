import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NodeJsRuntimeStreamingBlobPayloadOutputTypes } from '@smithy/types';
import { once } from 'node:events';
import fs from 'node:fs';
import { access, readdir, readFile } from 'node:fs/promises';
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
    const ws = body.pipe(fs.createWriteStream(`/tmp/${key}`));
    await once(ws, 'finish');

    await access(`/tmp/${key}`, fs.constants.F_OK);
    console.log('Saved video locally!');
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
  try {
    const files = await readdir(dirPath);
    console.log(`TOTAL FILES: ${files.length}`);

    for (const file of files) {
      const filePath = `${dirPath}/${file}`;
      console.log(`FILEPATH: ${filePath}`);

      const input = {
        Body: await readFile(filePath),
        Bucket: '1229975385-stage-1',
        // Key: `${dirName}/${file}`,
        Key: file,
      };
      console.log(`Starting upload for ${filePath}`);
      const uploadResult = await s3.send(new PutObjectCommand(input));
      console.log(`UPLOADED: ${file}, with VERSION: ${uploadResult.VersionId}`);
    }
  } catch (err) {
    console.log(err);
    const message = `Error uploading frames of video ${dirName} to bucket`;
    console.log(message);
    throw new Error(message);
  }
};
