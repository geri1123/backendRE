import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';

// Create folders if not exist
const imageDir = './uploads/images';
const documentDir = './uploads/documents';

[imageDir, documentDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Correct typing for destination & filename callbacks
const imageStorage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, imageDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const documentStorage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, documentDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter callback type
const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowed = /jpeg|jpg|png/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Only image files (jpeg, jpg, png) are allowed'));
};

const documentFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowed = /pdf|doc|docx/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Only document files (pdf, doc, docx) are allowed'));
};

// Create multer instances
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

// Export middleware functions
export const uploadSingleImage = imageUpload.single('image');
export const uploadMultipleImages = imageUpload.array('images', 5);

export const uploadSingleDocument = documentUpload.single('document');
export const uploadMultipleDocuments = documentUpload.array('documents', 5);
