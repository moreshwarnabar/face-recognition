import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export async function videoSplitter(video) {
  // const pathToVideo = path.resolve(video);

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
