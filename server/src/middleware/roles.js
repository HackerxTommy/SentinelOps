/**
 * Role-based access control middleware.
 * Must be used AFTER authMiddleware so that req.user is populated.
 *
 * Usage:
 *   router.post('/sensitive', auth, requireRole('owner', 'admin'), handler);
 *
 * Role hierarchy (most → least privileged):
 *   owner > admin > analyst > viewer
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden — insufficient permissions',
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
}

module.exports = { requireRole };
