import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash a plain text password
 * @param password - The plain password to hash
 * @returns The hashed password string
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain password with a hashed one
 * @param password - The plain password to check
 * @param hash - The hashed password to compare against
 * @returns True if they match, otherwise false
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a secure random token (e.g., for email verification)
 * @returns A 64-character hexadecimal string
 */
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex'); // 64 characters
};

/**
 * Generate a short public agency code (e.g., for agent registration)
 * @returns An 8-character uppercase code
 */
export const generatePublicCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 characters
};
