import ffmpeg from 'fluent-ffmpeg';
import { createDirectory } from './createDir';

export const videoSplitter = async (video: string) => {
  const dirName = video.split('.')[0];
  createDirectory(dirName);

  console.log(`Creating frames for ${video}`);
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(`/tmp/${video}`)
      .inputFPS(1)
      .seekInput(0)
      .frames(10)
      .videoFilters('fps=1/10')
      .save(`/tmp/${dirName}/output-%02d.jpg`)
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
