const jwt = require('jsonwebtoken');

/**
 * Session-based authentication middleware with JWT fallback.
 * Reads user identity from the server-side session, or an Authorization header.
 */
function authMiddleware(req, res, next) {
  // 1. Try Session
  if (req.session && req.session.userId) {
    req.user = {
      id: req.session.userId,
      userId: req.session.userId,
      orgId: req.session.orgId,
      role: req.session.role,
    };
    return next();
  }

  // 2. Try JWT Token (Fallback for strict 3rd-party cookie blocking)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sentinel-session-secret');
      req.user = {
        id: decoded.userId,
        userId: decoded.userId,
        orgId: decoded.orgId,
        role: decoded.role,
      };
      return next();
    } catch (err) {
      // Token verification failed, fall through to 401
    }
  }

  return res.status(401).json({ error: 'Authentication required' });
}

module.exports = authMiddleware;
