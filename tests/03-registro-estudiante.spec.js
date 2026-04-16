const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('./config');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

test.describe('Registro Estudiante', () => {
  test('Registro de estudiante en la aplicación', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());

    console.log('\n=== TEST 3: REGISTRO ESTUDIANTE ===');

    await page.goto('http://localhost:5173/student/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[type="email"]');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test03-01-login.png'), fullPage: true });
    console.log('✓ Captura: test03-01-login.png');

    await page.fill('input[type="email"]', config.estudiante.email);
    await page.fill('input[type="password"]', config.estudiante.password);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test03-02-credentials.png'), fullPage: true });
    console.log('✓ Captura: test03-02-credentials.png');

    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/student', { timeout: 10000 });
    
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=VISTA ESTUDIANTE');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test03-04-dashboard.png'), fullPage: true });
    console.log('✓ Captura: test03-04-dashboard.png');

    console.log(`\n=== TEST 3 COMPLETADO ===`);
    console.log(`Estudiante creado: ${config.estudiante.email}`);
  });
});