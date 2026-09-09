import crypto from 'crypto';

const getEncryptionKey = () => {
  const raw = process.env.PAYMOB_TOKEN_ENCRYPTION_KEY?.trim();
  if (!raw) {
    const error = new Error('PAYMOB_TOKEN_ENCRYPTION_KEY is required to save Paymob card tokens');
    error.statusCode = 503;
    throw error;
  }

  const key = /^[a-f0-9]{64}$/i.test(raw) ? Buffer.from(raw, 'hex') : Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    const error = new Error('PAYMOB_TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes');
    error.statusCode = 503;
    throw error;
  }
  return key;
};

export const encryptCardToken = (token) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return {
    encryptedToken: encrypted.toString('base64'),
    tokenIv: iv.toString('base64'),
    tokenAuthTag: cipher.getAuthTag().toString('base64'),
  };
};

export const decryptCardToken = ({ encryptedToken, tokenIv, tokenAuthTag }) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(tokenIv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(tokenAuthTag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedToken, 'base64')),
    decipher.final(),
  ]).toString('utf8');
};
