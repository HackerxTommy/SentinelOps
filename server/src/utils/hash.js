const bcrypt = require('bcrypt');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;

async function hashPassword(password) {
  return bcrypt.hash(password, ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
