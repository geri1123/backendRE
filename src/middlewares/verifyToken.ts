import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { UserUpdates } from '../repositories/user/UserUpdates.js';
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
      agencyId?:number;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.token ||
    (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
     res.status(401).json({ error: 'unauthorized', message: 'No token provided' });
  return;
  }

  try {
    const decoded = jwt.verify(token, config.secret.jwtSecret as string) as DecodedToken;
    req.user = decoded;
    req.userId = decoded.userId;
     if (decoded.agencyId) {
    req.agencyId = decoded.agencyId;
  }
    await UserUpdates.setLastActive(req.userId)
    next();
  } catch (error) {
     res.status(401).json({ error: 'unauthorized', message: 'Invalid or expired token' });
    return;
    }
};
