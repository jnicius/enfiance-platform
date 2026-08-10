const crypto = require('crypto');
const fs = require('fs');

const LEGACY_ALGORITHM = 'aes-256-cbc';
const NEW_ALGORITHM = 'aes-256-gcm';

const WALLET_KEY_PATH =
  process.env.WALLET_ENCRYPTION_KEY_PATH ||
  '/home/enfigrd/.enfiance-secrets/wallet-encryption-key';

// --------------------------------------------------
// LEGACY KEY
// Required only for decrypting existing v1 wallets.
// DO NOT remove JWT_SECRET until all wallets migrate.
// --------------------------------------------------

function getLegacyKey() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return crypto
    .createHash('sha256')
    .update(String(process.env.JWT_SECRET))
    .digest('base64')
    .substring(0, 32);
}

// --------------------------------------------------
// V2 WALLET KEY
// Dedicated 256-bit key stored outside application.
// --------------------------------------------------

function getWalletKey() {
  const hexKey = fs
    .readFileSync(WALLET_KEY_PATH, 'utf8')
    .trim();

  if (!/^[0-9a-fA-F]{64}$/.test(hexKey)) {
    throw new Error(
      'Wallet encryption key must be exactly 64 hexadecimal characters'
    );
  }

  return Buffer.from(hexKey, 'hex');
}

// --------------------------------------------------
// ENCRYPT
// All NEW encryption uses AES-256-GCM.
// Format:
// v2:<iv>:<authTag>:<ciphertext>
// --------------------------------------------------

function encrypt(text) {
  const key = getWalletKey();
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    NEW_ALGORITHM,
    key,
    iv
  );

  let encrypted =
    cipher.update(text, 'utf8', 'hex');

  encrypted += cipher.final('hex');

  const authTag =
    cipher.getAuthTag();

  return [
    'v2',
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted
  ].join(':');
}

// --------------------------------------------------
// LEGACY DECRYPT
// Existing database format:
// <iv>:<ciphertext>
// --------------------------------------------------

function decryptLegacy(hash) {
  const parts = hash.split(':');

  if (parts.length < 2) {
    throw new Error('Invalid legacy encrypted wallet format');
  }

  const ivBuffer =
    Buffer.from(parts.shift(), 'hex');

  const encryptedText =
    parts.join(':');

  const decipher =
    crypto.createDecipheriv(
      LEGACY_ALGORITHM,
      getLegacyKey(),
      ivBuffer
    );

  let decrypted =
    decipher.update(
      encryptedText,
      'hex',
      'utf8'
    );

  decrypted += decipher.final('utf8');

  return decrypted;
}

// --------------------------------------------------
// V2 DECRYPT
// --------------------------------------------------

function decryptV2(hash) {
  const parts = hash.split(':');

  if (
    parts.length !== 4 ||
    parts[0] !== 'v2'
  ) {
    throw new Error('Invalid v2 encrypted wallet format');
  }

  const [, ivHex, authTagHex, encryptedText] =
    parts;

  const decipher =
    crypto.createDecipheriv(
      NEW_ALGORITHM,
      getWalletKey(),
      Buffer.from(ivHex, 'hex')
    );

  decipher.setAuthTag(
    Buffer.from(authTagHex, 'hex')
  );

  let decrypted =
    decipher.update(
      encryptedText,
      'hex',
      'utf8'
    );

  decrypted += decipher.final('utf8');

  return decrypted;
}

// --------------------------------------------------
// AUTO-DETECT VERSION
// --------------------------------------------------

function decrypt(hash) {
  if (
    typeof hash !== 'string' ||
    hash.length === 0
  ) {
    throw new Error('Encrypted wallet key is missing');
  }

  if (hash.startsWith('v2:')) {
    return decryptV2(hash);
  }

  return decryptLegacy(hash);
}

module.exports = {
  encrypt,
  decrypt,
};
