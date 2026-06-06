import fs from 'fs';
import path from 'path';

export class FileService {
  static deleteFile(filePath) {
    const fullpath = path.resolve(filePath);
    fs.unlinkSync(fullpath);
  }
}
