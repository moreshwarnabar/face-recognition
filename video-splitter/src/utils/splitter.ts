import ffmpeg from 'fluent-ffmpeg';
import { createDirectory } from './createDir';
import fs from 'node:fs';

export const videoSplitter = async (video: string) => {
  const dirName = video.split('.')[0];
  createDirectory(dirName);
  fs.access(`/tmp/${video}`, fs.constants.F_OK, err => {
    if (err) console.log('Saved video not found', err);
    else console.log('Found the saved video');
  });

  console.log(`Creating frames for ${video}`);
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(`/tmp/${video}`)
      .inputFPS(1)
      .seekInput(0)
      .frames(1)
      .outputOptions(['-start_number 0'])
      .save(`/tmp/${dirName}/${dirName}.jpg`)
      .on('start', (commandLine: string) =>
        console.log('Command: ' + commandLine)
      )
      .on('progress', progress =>
        console.log(`PROGRESS FRAMES: ${progress.frames}`)
      )
      .on('end', () => resolve())
      .on('error', (error: string | undefined) => reject(new Error(error)));
  });
  console.log(`Frames created`);
};
