import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NodeJsRuntimeStreamingBlobPayloadOutputTypes } from '@smithy/types';
import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';

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
