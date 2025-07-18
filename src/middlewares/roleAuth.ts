// middleware/roleAuth.ts
import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Convenience functions
export const requireUser = requireRole(['user']);
export const requireAgent = requireRole(['agent']);
export const requireAgencyOwner = requireRole(['agency_owner']);
export const requireAgentOrOwner = requireRole(['agent', 'agency_owner']);