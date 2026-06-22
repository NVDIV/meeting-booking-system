const crypto = require('crypto');
const { promisify } = require('util');

// Перетворюємо scrypt на проміс, щоб використовувати асинхронний синтаксис async/await
const scrypt = promisify(crypto.scrypt);

/**
 * Хешує пароль за допомогою алгоритму scrypt та випадкової солі
 * @param {string} password - Чистий пароль користувача
 * @returns {Promise<string>} - Хеш у форматі "salt:derivedKey"
 */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Перевіряє чи збігається введений пароль із збереженим хешем
 * @param {string} password - Введений користувачем пароль
 * @param {string} storedHash - Хеш, який зберігається в базі даних
 * @returns {Promise<boolean>} - true, якщо пароль валідний
 */
async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  const derivedKey = await scrypt(password, salt, 64);
  return crypto.timingSafeEqual(derivedKey, Buffer.from(key, 'hex'));
}

// Допоміжна функція для кодування рядків у формат Base64Url (використовується в JWT)
const toBase64Url = (str) => Buffer.from(str).toString('base64url');

/**
 * Створює підписаний Access Token (кастомний JWT) для сесії користувача
 * @param {Object} user - Об'єкт користувача з бази даних
 * @returns {string} - Згенерований токен доступу (header.payload.signature)
 */
function createAccessToken(user) {
  const secret = process.env.JWT_SECRET || 'super-cyberpunk-secret-key-1337';
  
  // 1. Формуємо заголовок токена (Header)
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  
  // 2. Формуємо корисне навантаження (Payload)
  const payload = toBase64Url(JSON.stringify({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + (15 * 60) // Час життя: 15 хвилин
  }));

  // 3. Створюємо криптографічний підпис (Signature) на основі HMAC SHA-256
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Перевіряє токен на валідність та термін дії
 * @param {string} token - Токен з заголовка Authorization
 * @returns {Object|null} - Декодований payload, або null якщо токен невалідний/прострочений
 */
function verifyAccessToken(token) {
  try {
    const [header, payload, signature] = token.split('.');
    const secret = process.env.JWT_SECRET || 'super-cyberpunk-secret-key-1337';
    
    // Переобчислюємо підпис для перевірки
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    // Якщо підписи не збігаються — токен підроблено
    if (signature !== validSignature) return null;

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    // Перевіряємо, чи не вичерпано термін дії токена
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) return null;

    return decodedPayload;
  } catch (e) {
    return null;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  createAccessToken,
  verifyAccessToken
};