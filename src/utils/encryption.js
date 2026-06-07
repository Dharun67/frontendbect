// Crypto utility — pure in-memory helpers only.
// localStorage storage has been removed. All persistence goes through MongoDB
// via the API layer in utils/storage.js.

const SECRET_KEY = 'BEC_PORTAL_2025_SECRET_KEY_DO_NOT_SHARE';

// Simple encryption function
export const encrypt = (text) => {
  try {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(SECRET_KEY).reduce((a, b) => a ^ b, code);

    return text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (e) {
    console.error('Encryption error:', e);
    return text;
  }
};

// Simple decryption function
export const decrypt = (encoded) => {
  try {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(SECRET_KEY).reduce((a, b) => a ^ b, code);

    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
  } catch (e) {
    console.error('Decryption error:', e);
    return encoded;
  }
};

// Hash password (one-way encryption)
export const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

// Verify hashed password
export const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

// Obfuscate sensitive data for display
export const obfuscate = (text, visibleChars = 4) => {
  if (!text || text.length <= visibleChars) return '****';
  return text.substring(0, visibleChars) + '*'.repeat(text.length - visibleChars);
};

// Check if data is encrypted
export const isEncrypted = (data) => {
  return typeof data === 'string' && /^[0-9a-f]+$/i.test(data) && data.length > 20;
};
