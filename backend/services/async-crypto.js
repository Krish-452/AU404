const crypto = require('crypto');
const { promisify } = require('util');
const logger = require('./logger');

const scrypt = promisify(crypto.scrypt);

class AsyncCrypto {
  /**
   * Async scrypt key derivation (non-blocking)
   */
  static async deriveKey(password, salt, keyLength = 32) {
    try {
      return await scrypt(password, salt, keyLength);
    } catch (err) {
      logger.error('Scrypt derivation error:', err);
      throw err;
    }
  }

  /**
   * Wrap private key with password (async)
   */
  static async wrapKey(privateKeyHex, password, salt) {
    try {
      const key = await this.deriveKey(password, salt, 32);
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      let encrypted = cipher.update(privateKeyHex, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const tag = cipher.getAuthTag().toString('hex');

      return `${iv.toString('hex')}:${tag}:${encrypted}`;
    } catch (err) {
      logger.error('Key wrapping error:', err);
      throw err;
    }
  }

  /**
   * Unwrap private key with password (async)
   */
  static async unwrapKey(wrappedString, password, salt) {
    try {
      if (!wrappedString) throw new Error('No private key found');

      const parts = wrappedString.split(':');
      if (parts.length !== 3) throw new Error('Invalid key format');

      const iv = Buffer.from(parts[0], 'hex');
      const tag = Buffer.from(parts[1], 'hex');
      const encryptedData = parts[2];

      const key = await this.deriveKey(password, salt, 32);
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (err) {
      logger.error('Key unwrapping error:', err);
      throw err;
    }
  }

  /**
   * Generate random salt
   */
  static generateSalt(length = 16) {
    return crypto.randomBytes(length);
  }
}

module.exports = AsyncCrypto;
