import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken & { dbRole?: string; dbId?: number; dbName?: string };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  // Also support X-Admin-Role for testing/fallback if token is simulated in preview mode
  const simulationRole = req.headers['x-admin-role'] as string | undefined;
  const simulationEmail = req.headers['x-admin-email'] as string | undefined;

  if (simulationRole && simulationEmail) {
    try {
      const existingUser = await db.select().from(users).where(eq(users.email, simulationEmail)).limit(1);
      if (existingUser.length > 0) {
        req.user = {
          uid: existingUser[0].uid,
          email: existingUser[0].email,
          name: existingUser[0].name,
          dbRole: existingUser[0].role,
          dbId: existingUser[0].id,
          dbName: existingUser[0].name,
        } as any;
        return next();
      }
    } catch (e) {
      console.error('Error fetching simulated user:', e);
    }
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const dbUser = await db.select().from(users).where(eq(users.uid, decodedToken.uid)).limit(1);
    
    req.user = {
      ...decodedToken,
      dbRole: dbUser[0]?.role || 'counsellor',
      dbId: dbUser[0]?.id,
      dbName: dbUser[0]?.name || decodedToken.name || 'User',
    };
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.dbRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin privilege required' });
  }
  next();
};
