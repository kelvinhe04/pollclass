const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('./config');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

test.describe('Votar en Encuesta', () => {
  test('Unirse a una encuesta y votar como estudiante', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());

    console.log('\n=== TEST 4: VOTAR ===');

    await page.goto('http://localhost:5173/student/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[type="email"]');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-01-login.png'), fullPage: true });
    console.log('✓ Captura: test04-01-login.png');

    await page.fill('input[type="email"]', config.estudiante.email);
    await page.fill('input[type="password"]', config.estudiante.password);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-02-credentials.png'), fullPage: true });
    console.log('✓ Captura: test04-02-credentials.png');

    await page.click('button:has-text("INICIAR SESION")');
    await page.waitForURL('**/student', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=VISTA ESTUDIANTE');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-03-dashboard.png'), fullPage: true });
    console.log('✓ Captura: test04-03-dashboard.png');

    await page.fill('input[placeholder="ABC123"]', config.poll.code);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-04-code-filled.png'), fullPage: true });
    console.log('✓ Captura: test04-04-code-filled.png');

    await page.click('button:has-text("UNIRSE A ENCUESTA")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=VOTAR', { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-05-vote-form.png'), fullPage: true });
    console.log('✓ Captura: test04-05-vote-form.png');

    await page.locator('input[type="radio"]').first().check();
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-06-vote-selected.png'), fullPage: true });
    console.log('✓ Captura: test04-06-vote-selected.png');

    await page.click('button:has-text("VOTAR")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=VOTO REGISTRADO', { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-07-vote-confirmed.png'), fullPage: true });
    console.log('✓ Captura: test04-07-vote-confirmed.png');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'test04-08-results.png'), fullPage: true });
    console.log('✓ Captura: test04-08-results.png');

    console.log(`\n=== TEST 4 COMPLETADO ===`);
    console.log(`Voto registrado en encuesta: ${config.poll.title}`);
  });
});