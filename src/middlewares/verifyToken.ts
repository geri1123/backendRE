import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  agencyId?: number | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
      userId?: number;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return; 
  }

  try {
    const decoded = jwt.verify(token, config.secret.jwtSecret as string) as DecodedToken;
    req.user = decoded;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return; 
  }
};
