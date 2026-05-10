const User = require('../models/User');
const Organization = require('../models/Organization');
const { hashPassword, comparePassword } = require('../utils/hash');

/**
 * POST /api/auth/register
 * Creates a new user + organization, then sets the session.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, org_name } = req.body;

    if (!name || !email || !password || !org_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const org = await Organization.create({
      name: org_name,
      plan: 'free',
    });

    const password_hash = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash,
      org_id: org._id,
      role: 'owner',
    });

    // Note: User must login manually after registration

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      org: {
        id: org._id,
        name: org.name,
        plan: org.plan,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/auth/login
 * Authenticates with email + password, then sets the session.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: 'This account uses Google Sign-In. Please sign in with Google.' });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.last_login = new Date();
    await user.save();

    const org = await Organization.findById(user.org_id);

    // Set session
    req.session.userId = user._id;
    req.session.orgId = user.org_id;
    req.session.role = user.role;

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      org: {
        id: org._id,
        name: org.name,
        plan: org.plan,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user from the session.
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const org = await Organization.findById(req.user.orgId);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      org: {
        id: org._id,
        name: org.name,
        plan: org.plan,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/auth/google/callback  (called by passport after Google OAuth)
 * Sets session and redirects to the client dashboard — no token in URL.
 */
exports.googleCallback = (req, res) => {
  try {
    // req.user is populated by passport
    req.session.userId = req.user._id;
    req.session.orgId = req.user.org_id;
    req.session.role = req.user.role;

    // Remove trailing slash to prevent double-slash in redirects
    let clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173';
    
    // Save session before redirecting so the cookie is set
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${clientUrl}/auth?error=session_failed`);
      }
      res.redirect(`${clientUrl}/dashboard`);
    });
  } catch (err) {
    let clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173';
    res.redirect(`${clientUrl}/auth?error=auth_failed`);
  }
};

/**
 * POST /api/auth/logout
 * Destroys the session and clears the cookie.
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('sentinel.sid');
    res.json({ message: 'Logged out successfully' });
  });
};
