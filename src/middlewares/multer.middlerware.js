import multer from 'multer'

export const uploader= multer({
    storage:multer.diskStorage({}),
    limits:{ fileSize: 5 * 1024 * 1024 }
  });