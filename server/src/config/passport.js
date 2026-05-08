const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Organization = require('../models/Organization');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });

      if (user) {
        let changed = false;
        if (!user.sso_provider) {
          user.sso_provider = 'google';
          changed = true;
        }
        // Fix legacy users that might not pass new schema validation
        if (!user.org_id) {
          const org = await Organization.create({ name: `${user.name || 'User'}'s Organization`, plan: 'free' });
          user.org_id = org._id;
          changed = true;
        }
        if (!['owner', 'admin', 'analyst', 'viewer'].includes(user.role)) {
          user.role = 'owner';
          changed = true;
        }
        if (changed) {
          await user.save();
        }
        return done(null, user);
      }

      // If user doesn't exist, create an organization and a user
      const org = await Organization.create({
        name: `${profile.displayName}'s Organization`,
        plan: 'free',
      });

      user = await User.create({
        sso_provider: 'google',
        name: profile.displayName,
        email: profile.emails[0].value.toLowerCase(),
        org_id: org._id,
        role: 'owner',
        isEmailVerified: true
      });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

module.exports = passport;
