import ffmpeg from 'fluent-ffmpeg';
import { createDirectory } from './createDir.js';

export async function videoSplitter(video) {
  const dirName = video.split('.')[0].split('/')[1];
  createDirectory(dirName);
  console.log(dirName);

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(video)
      .inputFPS(1)
      .seekInput(0)
      .frames(10)
      .videoFilters('fps=1/10')
      .save('tmp/output-%02d.jpg')
      .on('start', commandLine => console.log('Command: ' + commandLine))
      .on('end', () => resolve())
      .on('error', error => reject(new Error(error)));
  });
}
