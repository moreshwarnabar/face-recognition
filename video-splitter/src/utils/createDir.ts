import fs from 'node:fs';
import path from 'node:path';

export function createDirectory(dirName: string) {
  console.log(`Creating ${dirName}`);
  try {
    const dirPath = path.join('/tmp/', dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  } catch (err) {
    console.error(err);
  }
}
