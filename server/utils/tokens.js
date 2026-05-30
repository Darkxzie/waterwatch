import jwt from 'jsonwebtoken';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
