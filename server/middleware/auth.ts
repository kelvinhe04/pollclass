import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pollclass-secret-key-change-in-production';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'No autorizado: token faltante' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; name: string; role: string; _id: string };
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Token inválido o expirado' }, 401);
  }
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    
    if (!user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    if (!roles.includes(user.role)) {
      return c.json({ error: 'Acceso denegado: rol insuficiente' }, 403);
    }

    await next();
  };
}

export function generateToken(payload: { sub: string; email: string; name: string; role: string; _id: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export { JWT_SECRET };