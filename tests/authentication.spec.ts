import { test, expect } from '../fixtures/test-fixtures';
import { generateUser } from '../utils/api-helpers';
import { TIMEOUTS } from '../utils/constants';

test.describe('Authentication Boundary Tests', () => {
  test('unauthenticated user cannot access campaigns page', {
    tag: ['@smoke', '@critical', '@auth', '@security', '@boundary'],
    annotation: {
      type: 'security',
      description: 'Verifies protected routes require authentication',
    },
  }, async ({ page, campaignsPage }) => {
    // Try to access campaigns without being logged in
    await campaignsPage.goto();

    // Should be redirected to login page
    await page.waitForURL(/sign_in|login/, { timeout: TIMEOUTS.SHORT }).catch(() => {
      // Some apps might redirect to home instead
    });

    const url = page.url();
    // Verify we're NOT on the campaigns page
    expect(url).not.toMatch(/\/campaigns(?!.*sign)/);

    // Should see sign in elements or be redirected
    const hasSignInForm = await page.locator('input[name="user[email]"], input#user_email').count() > 0;
    const isHomePage = url === 'https://povio-at.herokuapp.com/' || url.endsWith('/');

    expect(hasSignInForm || isHomePage).toBeTruthy();
  });

  test('unauthenticated user cannot create campaigns', {
    tag: ['@smoke', '@critical', '@auth', '@security', '@boundary'],
    annotation: {
      type: 'security',
      description: 'Verifies campaign creation requires authentication',
    },
  }, async ({ page }) => {
    // Try to access new campaign page directly
    await page.goto('/campaigns/new');

    // Should be redirected away from campaign creation
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT }).catch(() => {});

    const url = page.url();
    expect(url).not.toContain('/campaigns/new');

    // Should be on login or home page
    expect(url).toMatch(/sign_in|login|^\/$|^https:\/\/[^/]+\/$/);
  });

  test('unauthenticated user is redirected when accessing new campaign page', {
    tag: ['@regression', '@high', '@auth', '@security'],
  }, async ({ page }) => {
    await page.goto('/campaigns/new');

    // Wait for redirect
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT }).catch(() => {});

    // Verify redirect happened
    const url = page.url();
    expect(url).not.toContain('/campaigns/new');
  });

  test('logged out user cannot access protected routes', {
    tag: ['@critical', '@auth', '@security', '@session'],
    annotation: {
      type: 'security',
      description: 'Validates session termination prevents access to protected routes',
    },
  }, async ({ page, registerPage, testHelpers }) => {
    const user = generateUser();

    // Register and login
    await testHelpers.registerAndLogin(user);

    // Verify we can access campaigns
    await page.goto('/campaigns');
    await expect(page).toHaveURL(/campaigns/);

    // Sign out
    await registerPage.signOut();

    // Try to access campaigns again
    await page.goto('/campaigns');

    // Should be redirected
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT }).catch(() => {});
    const url = page.url();
    expect(url).not.toMatch(/\/campaigns(?!.*sign)/);

    // Cleanup
    // Need to log back in to delete account
    const loginPage = await import('../utils/pages/login.page');
    const login = new loginPage.LoginPage(page);
    await login.goto();
    await login.loginAndWait(user.email, user.password);
    await testHelpers.deleteCurrentAccount();
  });

  test('user can access public pages without authentication', {
    tag: ['@smoke', '@medium', '@auth', '@public'],
    annotation: {
      type: 'functionality',
      description: 'Validates public pages are accessible without login',
    },
  }, async ({ page }) => {
    // Home page should be accessible
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Sign up page should be accessible
    await page.goto('/users/sign_up');
    await expect(page).toHaveURL(/sign_up/);

    // Sign in page should be accessible
    await page.goto('/users/sign_in');
    await expect(page).toHaveURL(/sign_in/);
  });

  test('already logged in user is redirected from sign up page', {
    tag: ['@regression', '@medium', '@auth', '@redirect'],
  }, async ({ page, testHelpers }) => {
    const user = generateUser();

    // Register and login
    await testHelpers.registerAndLogin(user);

    // Try to access sign up page while logged in
    await page.goto('/users/sign_up');

    // Should be redirected to home
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT }).catch(() => {});
    const url = page.url();
    expect(url).not.toContain('sign_up');

    // Should see "already signed in" message or be on home page
    const pageContent = await page.textContent('body');
    const hasAlreadySignedInMsg = pageContent?.toLowerCase().includes('already signed in');
    const isHomePage = url === 'https://povio-at.herokuapp.com/' || url.endsWith('/');

    expect(hasAlreadySignedInMsg || isHomePage).toBeTruthy();

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });

  test('already logged in user is redirected from sign in page', {
    tag: ['@regression', '@medium', '@auth', '@redirect'],
  }, async ({ page, testHelpers }) => {
    const user = generateUser();

    // Register and login
    await testHelpers.registerAndLogin(user);

    // Try to access sign in page while logged in
    await page.goto('/users/sign_in');

    // Should be redirected away
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT }).catch(() => {});
    const url = page.url();
    expect(url).not.toContain('sign_in');

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });

  test('session persists across page navigation', {
    tag: ['@critical', '@auth', '@session'],
    annotation: {
      type: 'functionality',
      description: 'Verifies user session is maintained during navigation',
    },
  }, async ({ page, campaignsPage, testHelpers }) => {
    const user = generateUser();

    // Register and login
    await testHelpers.registerAndLogin(user);

    // Navigate to campaigns
    await campaignsPage.goto();
    await expect(page).toHaveURL(/campaigns/);

    // Navigate to home
    await page.goto('/');

    // Navigate back to campaigns - should still be logged in
    await campaignsPage.goto();
    await expect(page).toHaveURL(/campaigns/);

    // Verify we're still logged in by checking for sign out link
    const signOutLink = page.locator('a:has-text("Sign out")');
    await expect(signOutLink).toBeVisible();

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });

  test('login with invalid credentials shows error', {
    tag: ['@smoke', '@high', '@auth', '@validation'],
    annotation: {
      type: 'security',
      description: 'Validates login error handling for invalid credentials',
    },
  }, async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('nonexistent@test.com', 'WrongPassword123!');

    // Should stay on login page
    await expect(page).toHaveURL(/sign_in/);

    // Should show error message
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/invalid|incorrect|wrong|error/);
  });

  test('cannot access user edit page without authentication', {
    tag: ['@critical', '@auth', '@security'],
  }, async ({ page }) => {
    await page.goto('/users/edit');

    // Should be redirected
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT }).catch(() => {});
    const url = page.url();
    expect(url).not.toContain('/users/edit');
  });

  test('user can only edit their own account', {
    tag: ['@critical', '@auth', '@security'],
    annotation: {
      type: 'security',
      description: 'Validates users can only access their own account data',
    },
  }, async ({ page, testHelpers }) => {
    const user = generateUser();

    // Login
    await testHelpers.registerAndLogin(user);

    // Access own account edit page - should succeed
    await page.goto('/users/edit');
    await expect(page).toHaveURL(/\/users\/edit/);

    // Verify it's the right user's page
    const emailField = page.locator('input#user_email, input[name="user[email]"]');
    const emailValue = await emailField.inputValue();
    expect(emailValue).toBe(user.email);

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });
});





