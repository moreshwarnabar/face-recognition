import fs from 'node:fs';

export function createDirectory(dirName: string) {
  try {
    if (!fs.existsSync(`tmp/${dirName}`)) {
      fs.mkdirSync(`tmp/${dirName}`);
    }
  } catch (err) {
    console.error(err);
  }
}
