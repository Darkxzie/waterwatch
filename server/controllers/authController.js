import bcrypt from 'bcryptjs';
import { loginSchema, registerSchema } from '@waterwatch/shared/schemas';
import { prisma } from '../utils/prisma.js';
import { created, fail, ok } from '../utils/response.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

function authPayload(user) {
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken: signAccessToken(user),
  };
}

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req, res, next) {
  try {
    const input = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });

    if (existing) {
      return fail(res, 409, 'Email already registered');
    }

    const password = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({ data: { ...input, password } });
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);
    return created(res, authPayload(user));
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      return fail(res, 401, 'Invalid email or password');
    }

    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);
    return ok(res, authPayload(user));
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return fail(res, 401, 'Refresh token missing');
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return fail(res, 401, 'User not found');
    }

    return ok(res, authPayload(user));
  } catch {
    return fail(res, 401, 'Invalid refresh token');
  }
}

export function logout(_req, res) {
  res.clearCookie('refreshToken');
  return ok(res, { message: 'Logged out successfully' });
}
