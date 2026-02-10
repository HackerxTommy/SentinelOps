/**
 * Session-based authentication middleware.
 * Reads user identity from the server-side session (backed by HttpOnly cookie).
 */
function authMiddleware(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Populate req.user from session for downstream handlers
  req.user = {
    id: req.session.userId,
    userId: req.session.userId,
    orgId: req.session.orgId,
    role: req.session.role,
  };

  next();
}

module.exports = authMiddleware;
