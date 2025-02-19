const crypto = require('crypto');

const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex'); // Generates a 64-byte (128-character) hex string
};

const secret = generateSecret();
console.log(secret); // This is your JWT secret