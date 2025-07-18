import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generatePublicCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};
