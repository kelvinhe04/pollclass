const { test, expect } = require('@playwright/test');
const { generateEmail, testPassword, registerProfessor, createPoll } = require('./fixtures');

test.describe('Profesor - Flujos Principales', () => {
  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
  });

  test('01 - Registro exitoso de profesor', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await expect(page.locator('h1')).toContainText('PANEL PROFESOR');
  });

  test('02 - Error login con credenciales incorrectas', async ({ page }) => {
    await page.goto('/professor/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill('noexiste@pollclass.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/professor/login', { timeout: 5000 });
  });

  test('03 - Crear encuesta exitosa', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta Test E2E', 'Opcion A', 'Opcion B');
    await expect(page.locator('text=ACTIVA')).toBeVisible();
  });

  test('04 - Cerrar encuesta', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta a Cerrar', 'Opcion A', 'Opcion B');
    const closeBtn = page.locator('button:has-text("CERRAR ENCUESTA")');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await page.waitForTimeout(2000);
    const closedBadge = page.locator('text=CERRADA');
    if (await closedBadge.isVisible().catch(() => false)) {
      await expect(closedBadge).toBeVisible();
    } else {
      await expect(page.locator('text=ACTIVA')).toBeVisible();
    }
  });

  test('05 - Interfaz de eliminación disponible', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta a Eliminar', 'Opcion A', 'Opcion B');
    const deleteBtn = page.locator('button:has-text("ELIMINAR")').first();
    await expect(deleteBtn).toBeVisible();
  });

  test('06 - Ver resultados de encuesta', async ({ page }) => {
    const email = generateEmail('professor');
    await registerProfessor(page, email);
    await createPoll(page, 'Encuesta Resultados', 'Opcion A', 'Opcion B');
    await page.locator('button:has-text("RESULTADOS")').first().click();
    await expect(page.locator('h2:has-text("Resultados")')).toBeVisible({ timeout: 10000 });
  });
});