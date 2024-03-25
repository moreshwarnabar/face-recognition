import fs from 'node:fs';
import path from 'node:path';

export function createDirectory(filePath: string, dirName: string) {
  try {
    const dirPath = path.join('/tmp/', filePath, dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  } catch (err) {
    console.error(err);
  }
}
