import { Hono } from 'hono';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

export const authRouter = new Hono();

authRouter.post('/register', async (c) => {
  const { email, password, name, role } = await c.req.json();

  if (!email || !password || !name || !role) {
    return c.json({ error: 'Todos los campos son requeridos' }, 400);
  }

  if (password.length < 4) {
    return c.json({ error: 'La contrasena debe tener al menos 4 caracteres' }, 400);
  }

  if (!['professor', 'student'].includes(role)) {
    return c.json({ error: 'Rol invalido' }, 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return c.json({ error: 'El email ya esta registrado' }, 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role
  });

  await user.save();

  const token = generateToken({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    _id: user._id.toString()
  });

  return c.json({
    user: { _id: user._id, email: user.email, name: user.name, role: user.role },
    token
  }, 201);
});

authRouter.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email y contrasena requeridos' }, 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return c.json({ error: 'Credenciales invalidas' }, 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return c.json({ error: 'Credenciales invalidas' }, 401);
  }

  const token = generateToken({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    _id: user._id.toString()
  });

  return c.json({
    user: { _id: user._id, email: user.email, name: user.name, role: user.role },
    token
  });
});

authRouter.get('/me', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  return c.json({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  });
});