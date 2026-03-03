import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
  const fullpath = path.resolve(filePath);
  fs.unlinkSync(fullpath);
};
