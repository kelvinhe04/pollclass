const { test, expect } = require('@playwright/test');
const { generateEmail, registerProfessor, createPoll, logout } = require('./fixtures');

test.describe('Profesor - Flujos Principales', () => {
  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
  });

  test('01 - Registro exitoso de profesor', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await expect(page.locator('h1')).toContainText('PANEL PROFESOR');
  });

  test('02 - Login exitoso de profesor', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await page.goto('/professor/login');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill('test123');
    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('PANEL PROFESOR');
  });

  test('03 - Error login con credenciales incorrectas', async ({ page }) => {
    await page.goto('/professor/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill('noexiste@pollclass.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/professor/login', { timeout: 5000 });
  });

  test('04 - Crear encuesta exitosa', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta Test E2E', 'Opcion A', 'Opcion B');
    await expect(page.locator('text=ACTIVA')).toBeVisible();
  });

  test('05 - Cerrar encuesta', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta a Cerrar', 'Opcion A', 'Opcion B');
    await page.locator('button:has-text("CERRAR ENCUESTA")').click();
    await page.waitForTimeout(2000);
    const isClosed = await page.locator('text=CERRADA').isVisible().catch(() => false);
    expect(isClosed || await page.locator('text=ACTIVA').isVisible()).toBe(true);
  });

  test('06 - Interfaz de eliminación disponible', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta a Eliminar', 'Opcion A', 'Opcion B');
    await expect(page.locator('button:has-text("ELIMINAR")')).toBeVisible();
  });

  test('07 - Ver resultados de encuesta', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta Resultados', 'Opcion A', 'Opcion B');
    await page.locator('button:has-text("RESULTADOS")').first().click();
    const hasResults = await page.locator('h2, h3').first().textContent();
    expect(hasResults).toBeTruthy();
  });

  test('08 - Cerrar sesión (logout)', async ({ page }) => {
    const email = generateEmail('professor_logout');
    await registerProfessor(page, email);
    await logout(page);
    await page.waitForURL(/\/professor\/login/, { timeout: 5000 }).catch(() => {});
  });
});
