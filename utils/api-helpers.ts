import { APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://povio-at.herokuapp.com';

/**
 * TestUser class provides object-oriented approach to test user management.
 * Encapsulates user credentials and session state with methods for API operations.
 */
export class TestUser {
  private name: string;
  private email: string;
  private password: string;
  private sessionCookies?: string;

  /**
   * Creates a new test user with unique credentials based on timestamp.
   */
  constructor() {
    const timestamp = Date.now();
    this.name = `Test User ${timestamp}`;
    this.email = `testuser_${timestamp}@mailinator.com`;
    this.password = 'Password123!';
  }

  /**
   * Creates a test user with custom credentials (useful for specific test scenarios).
   */
  static withCredentials(name: string, email: string, password: string): TestUser {
    const user = new TestUser();
    user.name = name;
    user.email = email;
    user.password = password;
    return user;
  }

  /**
   * Logs in the user via API and stores session cookies.
   * @param request - Playwright API request context
   * @throws Error if login fails
   */
  async login(request: APIRequestContext): Promise<void> {
    // Get CSRF token from sign-in page
    const signInPage = await request.get(`${BASE_URL}/users/sign_in`);
    const html = await signInPage.text();
    const csrfMatch = html.match(/name="authenticity_token" value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';

    // Login
    const loginResponse = await request.post(`${BASE_URL}/users/sign_in`, {
      form: {
        'user[email]': this.email,
        'user[password]': this.password,
        authenticity_token: csrfToken,
      },
      maxRedirects: 5,
    });

    this.sessionCookies = loginResponse.headers()['set-cookie'] || '';

    if (!this.sessionCookies) {
      throw new Error(`Failed to login user ${this.email}`);
    }
  }

  /**
   * Deletes the user account via API.
   * @param request - Playwright API request context
   * @throws Error if user is not logged in
   */
  async deleteAccount(request: APIRequestContext): Promise<void> {
    if (!this.sessionCookies) {
      throw new Error('User must be logged in before deleting account. Call login() first.');
    }

    // Get CSRF token from account page
    const accountPage = await request.get(`${BASE_URL}/users/edit`, {
      headers: { Cookie: this.sessionCookies },
    });
    const html = await accountPage.text();
    const csrfMatch = html.match(/name="authenticity_token" value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';

    await request.delete(`${BASE_URL}/users`, {
      headers: {
        Cookie: this.sessionCookies,
        'X-CSRF-Token': csrfToken,
      },
    });
  }

  /**
   * Returns user credentials as a plain object.
   * Useful for UI registration/login operations.
   */
  getCredentials(): { name: string; email: string; password: string } {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  /**
   * Returns the user's name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Returns the user's email.
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * Returns the user's password.
   */
  getPassword(): string {
    return this.password;
  }

  /**
   * Returns the session cookies if user is logged in.
   */
  getSessionCookies(): string | undefined {
    return this.sessionCookies;
  }

  /**
   * Checks if the user is currently logged in (has session cookies).
   */
  isLoggedIn(): boolean {
    return !!this.sessionCookies;
  }
}

/**
 * Legacy function for backward compatibility.
 * Generates a test user credentials object.
 *
 * @deprecated Use `new TestUser()` instead for better OOP design.
 */
export function generateUser(): { name: string; email: string; password: string } {
  const user = new TestUser();
  return user.getCredentials();
}

/**
 * Legacy function for backward compatibility.
 * Logs in via the API and returns the session cookie string.
 *
 * @deprecated Use `TestUser.login()` method instead.
 */
export async function apiLogin(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const user = TestUser.withCredentials('Legacy User', email, password);
  await user.login(request);
  return user.getSessionCookies() || '';
}

/**
 * Legacy function for backward compatibility.
 * Deletes a user account. Must be called while logged in as that user.
 *
 * @deprecated Use `TestUser.deleteAccount()` method instead.
 */
export async function deleteAccount(request: APIRequestContext, sessionCookies: string): Promise<void> {
  // For legacy support, we need to create a user and manually set cookies
  const accountPage = await request.get(`${BASE_URL}/users/edit`, {
    headers: { Cookie: sessionCookies },
  });
  const html = await accountPage.text();
  const csrfMatch = html.match(/name="authenticity_token" value="([^"]+)"/);
  const csrfToken = csrfMatch ? csrfMatch[1] : '';

  await request.delete(`${BASE_URL}/users`, {
    headers: {
      Cookie: sessionCookies,
      'X-CSRF-Token': csrfToken,
    },
  });
}


