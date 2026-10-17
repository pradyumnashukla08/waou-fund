import type { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase.ts';

/**
 * Extends the Express Request with authenticated user fields.
 * After passing through requireAuth, `req.userId` and `req.userEmail`
 * are guaranteed to be populated.
 */
export interface AuthenticatedRequest extends Request {
  userId: string;
  userEmail?: string | undefined;
  token: string;
}

/**
 * Express middleware that enforces Firebase JWT authentication.
 * Extracts the Bearer token, verifies it against Firebase Auth,
 * and injects the authenticated user's ID into the request object.
 * 
 * Usage: router.post('/', requireAuth, async (req, res) => { ... })
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Missing bearer token' });
      return;
    }

    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken || !decodedToken.uid) {
      console.error('[Auth Middleware] Verification failed: missing uid in token');
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      return;
    }

    // Inject authenticated user data into the request for downstream handlers
    (req as AuthenticatedRequest).userId = decodedToken.uid;
    (req as AuthenticatedRequest).userEmail = decodedToken.email;
    (req as AuthenticatedRequest).token = token;

    next();
  } catch (error) {
    console.error('[Auth Middleware] Unexpected error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
