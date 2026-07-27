const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

const secretKey = crypto
  .createHash('sha256')
  .update(String(process.env.JWT_SECRET))
  .digest('base64')
  .substring(0, 32);

const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    algorithm,
    secretKey,
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');

  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(hash) {
  const parts = hash.split(':');

  const ivBuffer = Buffer.from(parts.shift(), 'hex');

  const encryptedText = parts.join(':');

  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    ivBuffer
  );

  let decrypted = decipher.update(
    encryptedText,
    'hex',
    'utf8'
  );

  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
