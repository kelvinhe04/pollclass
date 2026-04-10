import { Context, Next } from 'hono';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    const stack = err instanceof Error ? err.stack : '';
    console.error('Error:', message);
    console.error('Stack:', stack);
    return c.json({ error: message, details: stack }, 500);
  }
}