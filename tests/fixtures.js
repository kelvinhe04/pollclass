function generateEmail(role) {
  return `${role}_${Date.now()}@test.com`;
}

const testPassword = 'test123';

async function registerProfessor(page, email, name = 'Profesor Test') {
  await page.goto('/professor/register');
  await page.waitForLoadState('networkidle');
  await page.locator('input[placeholder="Tu nombre"]').fill(name);
  await page.locator('input[placeholder="tu@email.com"]').fill(email);
  await page.locator('input[placeholder="Minimo 4 caracteres"]').fill(testPassword);
  await page.locator('input[placeholder="Repite tu contrasena"]').fill(testPassword);
  await page.click('button:has-text("CREAR CUENTA")');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

async function loginProfessor(page, email) {
  await page.goto('/professor/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(testPassword);
  await page.click('button:has-text("INICIAR SESION")');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

async function registerStudent(page, email, name = 'Estudiante Test') {
  await page.goto('/student/register');
  await page.waitForLoadState('networkidle');
  await page.locator('input[placeholder="Tu nombre"]').fill(name);
  await page.locator('input[placeholder="tu@email.com"]').fill(email);
  await page.locator('input[placeholder="Minimo 4 caracteres"]').fill(testPassword);
  await page.locator('input[placeholder="Repite tu contrasena"]').fill(testPassword);
  await page.click('button:has-text("CREAR CUENTA")');
  await page.waitForURL('**/student', { timeout: 15000 });
}

async function loginStudent(page, email) {
  await page.goto('/student/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(testPassword);
  await page.click('button:has-text("INICIAR SESION")');
  await page.waitForURL('**/student', { timeout: 15000 });
}

async function createPoll(page, title, option1, option2) {
  await page.locator('input[placeholder*="Que tema"]').fill(title);
  await page.locator('input[placeholder="Opcion 1"]').fill(option1);
  await page.locator('input[placeholder="Opcion 2"]').fill(option2);
  await page.click('button:has-text("CREAR ENCUESTA")');
  await page.waitForSelector(`text=${title}`, { timeout: 15000 });
}

async function closePoll(page) {
  await page.locator('button:has-text("CERRAR ENCUESTA")').first().click();
  await page.waitForTimeout(2000);
}

async function deletePoll(page) {
  await page.locator('button:has-text("ELIMINAR")').first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("CONFIRMAR")').click().catch(() => {});
  await page.waitForTimeout(1000);
}

async function joinPollWithCode(page, code) {
  await page.locator('input[placeholder="ABC123"]').fill(code);
  await page.click('button:has-text("UNIRSE A ENCUESTA")');
  await page.waitForTimeout(2000);
}

async function submitVote(page) {
  await page.locator('button:has-text("VOTAR")').click();
  await page.waitForTimeout(1000);
}

async function logout(page) {
  await page.locator('button:has-text("CERRAR SESION")').click();
  await page.waitForTimeout(1500);
  const confirmBtn = page.locator('button:has-text("CONFIRMAR")');
  if (await confirmBtn.isVisible().catch(() => false)) {
    await confirmBtn.click();
    await page.waitForTimeout(1000);
  }
}

module.exports = {
  generateEmail,
  testPassword,
  registerProfessor,
  loginProfessor,
  registerStudent,
  loginStudent,
  createPoll,
  closePoll,
  deletePoll,
  joinPollWithCode,
  submitVote,
  logout,
};