import { FileTypeValidator, ParseFilePipe } from '@nestjs/common';
import { type MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: './uploads', // or use a function to dynamically set the path
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

export const fileFilter = (req, file, cb): void => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
    cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const limits = {
  fileSize: 30 * 1024 * 1024,
};

export const filePipeValidator = new ParseFilePipe({
  validators: [
    new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|webp|pdf|mp4)' }),
  ],
  fileIsRequired: true,
});

export const multerOptions: MulterOptions = { storage, fileFilter, limits };
