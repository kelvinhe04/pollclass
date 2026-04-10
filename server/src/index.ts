import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from '../config/db.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';
import { pollsRouter } from '../routes/polls.js';
import { votesRouter } from '../routes/votes.js';
import { authRouter } from '../routes/auth.js';
import { studentRouter } from '../routes/student.js';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

app.use('*', errorHandler);

app.get('/', (c) => c.text('PollClass API - running'));

// Rutas públicas
app.route('/api/auth', authRouter);

// Rutas protegidas con autenticación
app.use('/api/polls/*', authMiddleware);
app.use('/api/student/*', authMiddleware);
app.route('/api/polls', pollsRouter);
app.route('/api/polls', votesRouter);
app.route('/api/student', studentRouter);

const PORT = parseInt(process.env.PORT || '3001');

console.log('Conectando a MongoDB...');
await connectDB();
console.log('MongoDB conectado');

console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
export default {
  port: PORT,
  hostname: '0.0.0.0',
  fetch: app.fetch
};