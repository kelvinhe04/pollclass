const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export async function generateUniqueCode(): Promise<string> {
  const { Poll } = await import('../models/Poll.js');
  let code = generateCode();
  const existing = await Poll.findOne({ code });
  if (existing) return generateUniqueCode();
  return code;
}