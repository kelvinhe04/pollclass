const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('./config');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

test.describe('Registro Profesor', () => {
  test('Registro de profesor en la aplicación', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());

console.log('\n=== TEST 1: REGISTRO PROFESOR ===');

    await page.goto('http://localhost:5173/professor/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[type="email"]');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test01-01-login.png'), fullPage: true });
    console.log('✓ Captura: test01-01-login.png');

    await page.fill('input[type="email"]', config.profesor.email);
    await page.fill('input[type="password"]', config.profesor.password);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test01-02-credentials.png'), fullPage: true });
    console.log('✓ Captura: test01-02-credentials.png');

    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=PANEL PROFESOR');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test01-04-dashboard.png'), fullPage: true });
    console.log('✓ Captura: test01-04-dashboard.png');

    console.log(`\n=== TEST 1 COMPLETADO ===`);
    console.log(`Profesor creado: ${config.profesor.email}`);
  });
});