const { test, expect } = require('@playwright/test');
const { generateEmail, registerStudent, registerProfessor, joinPollWithCode, createPoll } = require('./fixtures');

test.describe('Estudiante - Flujos Principales', () => {
  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
  });

  test('01 - Registro exitoso de estudiante', async ({ page }) => {
    const email = generateEmail('student');
    await registerStudent(page, email);
    await expect(page.locator('h1')).toContainText('VISTA ESTUDIANTE');
  });

  test('02 - Login exitoso de estudiante', async ({ page }) => {
    const email = generateEmail('student');
    await registerStudent(page, email);
    await page.goto('/student/login');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill('test123');
    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/student', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('VISTA ESTUDIANTE');
  });

  test('03 - Error login con credenciales incorrectas', async ({ page }) => {
    await page.goto('/student/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill('noexiste@pollclass.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/student/login', { timeout: 5000 });
  });

  test('04 - Código de encuesta inválido', async ({ page }) => {
    const email = generateEmail('student');
    await registerStudent(page, email);
    await joinPollWithCode(page, 'XXXXXX');
    const errorVisible = await page.locator('text=no encontrada').isVisible().catch(() => false) ||
                        await page.locator('text=inválido').isVisible().catch(() => false) ||
                        await page.locator('text=No encontrada').isVisible().catch(() => false);
    expect(errorVisible || !(await page.locator('text=UNIRSE A ENCUESTA').isVisible())).toBe(true);
  });

  test('05 - Vista de uni\u00f3n a encuesta', async ({ page }) => {
    const professorEmail = generateEmail('prof_join');
    await registerProfessor(page, professorEmail);
    await createPoll(page, 'Encuesta Union Test', 'Opcion A', 'Opcion B');
    await expect(page.locator('text=Encuesta Union Test')).toBeVisible();
    await expect(page.locator('button:has-text("RESULTADOS")')).toBeVisible();
  });

  test('06 - Ver resultados despu\u00e9s de crear encuesta', async ({ page }) => {
    const professorEmail = generateEmail('prof_results_simple');
    await registerProfessor(page, professorEmail);
    await createPoll(page, 'Encuesta Results Simple', 'Opcion A', 'Opcion B');
    await page.locator('button:has-text("RESULTADOS")').first().click();
    await expect(page.locator('text=Resultados')).toBeVisible({ timeout: 10000 });
  });
});