import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'shramsetu_sih_secure_jwt_secret_key_2026';
    try {
      const decoded = jwt.verify(token, secret) as { id: string; email: string; role: UserRole };
      req.user = decoded;
      next();
      return;
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
  }
  res.status(401).json({ message: 'Authorization token required' });
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions for this role' });
      return;
    }
    next();
  };
};
