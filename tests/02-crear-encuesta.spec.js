const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('./config');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

test.describe('Crear Encuesta', () => {
  test('Crear una encuesta como profesor', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());

    console.log('\n=== TEST 2: CREAR ENCUESTA ===');

    await page.goto('http://localhost:5173/professor/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[type="email"]');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test02-01-login.png'), fullPage: true });
    console.log('✓ Captura: test02-01-login.png');

    await page.fill('input[type="email"]', config.profesor.email);
    await page.fill('input[type="password"]', config.profesor.password);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test02-02-credentials.png'), fullPage: true });
    console.log('✓ Captura: test02-02-credentials.png');

    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=PANEL PROFESOR');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test02-03-dashboard.png'), fullPage: true });
    console.log('✓ Captura: test02-03-dashboard.png');

    await page.fill('input[placeholder="Ej: Que tema te interesa mas?"]', config.poll.title);
    await page.locator('input[placeholder="Opcion 1"]').fill(config.poll.options[0]);
    await page.locator('input[placeholder="Opcion 2"]').fill(config.poll.options[1]);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test02-04-form-filled.png'), fullPage: true });
    console.log('✓ Captura: test02-04-form-filled.png');

    await page.click('button:has-text("CREAR ENCUESTA")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector(`text=${config.poll.title}`, { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test02-05-poll-created.png'), fullPage: true });
    console.log('✓ Captura: test02-05-poll-created.png');

    const pollCode = await page.locator('p:has-text("Codigo de acceso") + p').first().textContent();
    console.log(`\n=== TEST 2 COMPLETADO ===`);
    console.log(`Encuesta creada: ${config.poll.title}`);
    console.log(`Código: ${pollCode.trim()}`);
  });
});