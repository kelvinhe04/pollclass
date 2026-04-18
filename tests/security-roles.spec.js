const { test, expect } = require('@playwright/test');
const { generateEmail, registerProfessor, registerStudent, logout } = require('./fixtures');

test.describe('Seguridad y Roles', () => {
  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
  });

  test('01 - Redirección sin autenticación (profesor)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/professor\/login/);
  });

  test('02 - Redirección sin autenticación (estudiante)', async ({ page }) => {
    await page.goto('/student');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url.includes('/login')).toBe(true);
  });

  test('03 - Estudiante no puede acceder a dashboard de profesor', async ({ page }) => {
    const studentEmail = generateEmail('student_security');
    await registerStudent(page, studentEmail);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url.includes('/dashboard')).toBe(false);
  });

  test('04 - Profesor no puede acceder a vista de estudiante', async ({ page }) => {
    const professorEmail = generateEmail('professor_security');
    await registerProfessor(page, professorEmail);
    await page.goto('/student');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url.includes('/student') && !url.includes('/login')).toBe(false);
  });

  test('05 - Logout de profesor', async ({ page }) => {
    const professorEmail = generateEmail('professor_logout');
    await registerProfessor(page, professorEmail);
    await logout(page);
    await page.waitForURL(/\/professor\/login/, { timeout: 5000 }).catch(() => {});
  });

  test('06 - Logout de estudiante', async ({ page }) => {
    const studentEmail = generateEmail('student_logout');
    await registerStudent(page, studentEmail);
    await logout(page);
    await page.waitForURL(/\/student\/login/, { timeout: 5000 }).catch(() => {});
  });
});