const { test, expect } = require('@playwright/test');
const { generateEmail, registerStudent, registerProfessor, joinPollWithCode, createPoll, logout } = require('./fixtures');

test.describe('Estudiante - Flujos Principales', () => {
  let pollCode;

  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    pollCode = null;
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
    await expect(page.locator('text=Encuesta no encontrada')).toBeVisible();
  });

  test('05 - Unirse a encuesta activa', async ({ page }) => {
    const professorEmail = generateEmail('prof_poll');
    await registerProfessor(page, professorEmail);
    await createPoll(page, 'Encuesta para Unirse', 'Opcion A', 'Opcion B');
    const codeElement = page.locator('[class*="font-mono"]');
    pollCode = await codeElement.textContent();
    await page.goto('/student/register');
    const studentEmail = generateEmail('student_join');
    await registerStudent(page, studentEmail);
    await joinPollWithCode(page, pollCode.trim().substring(0, 6));
    await expect(page.locator('button:has-text("VOTAR")')).toBeVisible();
  });

  test('06 - Ver resultados después de unirse', async ({ page }) => {
    const professorEmail = generateEmail('prof_results3');
    await registerProfessor(page, professorEmail);
    await createPoll(page, 'Encuesta para Ver', 'Opcion A', 'Opcion B');
    const codeElement = page.locator('[class*="font-mono"]');
    pollCode = await codeElement.textContent();
    await page.goto('/student/register');
    const studentEmail = generateEmail('student_view');
    await registerStudent(page, studentEmail);
    await joinPollWithCode(page, pollCode.trim().substring(0, 6));
    await expect(page.locator('button:has-text("VOTAR")')).toBeVisible();
  });

  test('07 - Voto duplicado (CASO NEGATIVO)', async ({ page }) => {
    const professorEmail = generateEmail('prof_duplicate');
    await registerProfessor(page, professorEmail);
    await createPoll(page, 'Encuesta Voto Doble', 'Opcion A', 'Opcion B');
    const codeElement = page.locator('[class*="font-mono"]');
    pollCode = await codeElement.textContent();
    pollCode = pollCode.trim().substring(0, 6);

    await page.goto('/student/register');
    const studentEmail = generateEmail('student_dup');
    await registerStudent(page, studentEmail);
    await joinPollWithCode(page, pollCode);

    // Primer voto: seleccionar opción y votar
    await page.locator('input[type="radio"]').first().click();
    await page.click('button:has-text("VOTAR")');
    await expect(page.locator('text=VOTO REGISTRADO')).toBeVisible({ timeout: 10000 });

    // Volver a la vista de unirse y reintentar con el mismo código
    await page.click('button:has-text("VOTAR EN OTRA ENCUESTA")');
    await page.waitForTimeout(1000);
    await joinPollWithCode(page, pollCode);

    // El sistema debe detectar el voto previo
    await expect(page.locator('text=YA VOTASTE EN ESTA ENCUESTA')).toBeVisible({ timeout: 10000 });
  });
});
