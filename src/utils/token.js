import jwt from 'jsonwebtoken';

export class TokenService {
  static generateToken({
    payload = {},
    secretKey = process.env.JWT_SECRET_KEY,
    expiresIn = '100d',
  }) {
    return jwt.sign(payload, secretKey, { expiresIn });
  }

  static verifyToken({ token = '', secretKey = process.env.JWT_SECRET_KEY }) {
    return jwt.verify(token, secretKey);
  }
}
