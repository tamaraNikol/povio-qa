import { test, expect } from '../fixtures/test-fixtures';
import { generateUser } from '../utils/api-helpers';
import { TIMEOUTS } from '../utils/constants';

test.describe('Registration', () => {
  test('new valid user can register successfully', {
    tag: ['@smoke', '@critical', '@registration', '@auth'],
    annotation: {
      type: 'feature',
      description: 'User registration - happy path',
    },
  }, async ({ page, registerPage, testHelpers }) => {
    const user = generateUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);

    // After successful registration, user is redirected (not on sign_up anymore)
    await expect(page).not.toHaveURL(/sign_up/);

    // Flash message confirms success
    const flash = page.locator('.alert, .notice, [class*="flash"]');
    await expect(flash).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });

  test('cannot register with an already existing email', {
    tag: ['@regression', '@high', '@registration', '@validation'],
    annotation: {
      type: 'feature',
      description: 'User registration - duplicate email validation',
    },
  }, async ({ page, registerPage, loginPage, testHelpers }) => {
    const user = generateUser();

    // --- Setup: register the user once ---
    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);
    await expect(page).not.toHaveURL(/sign_up/);

    // --- Sign out before attempting to register again ---
    await registerPage.signOut();

    // --- Act: try to register again with same email ---
    await registerPage.goto();
    await registerPage.register(`Another ${user.name}`, user.email, user.password);

    // Should stay on sign_up or /users (form post endpoint) with an error
    await expect(page).toHaveURL(/sign_up|\/users$/);
    const errors = await registerPage.getErrors();
    expect(errors.toLowerCase()).toMatch(/email|taken|already/);

    // --- Cleanup: log in as original user and delete account ---
    await loginPage.goto();
    await loginPage.loginAndWait(user.email, user.password);
    await testHelpers.deleteCurrentAccount();
  });
});
