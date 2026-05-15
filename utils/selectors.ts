/**
 * Selectors Constants
 *
 * Centralized CSS selectors for all page objects to avoid magic strings
 * and improve maintainability.
 */

/**
 * Common selectors used across multiple pages
 */
export const COMMON = {
  /** Flash/alert message selectors */
  FLASH_MESSAGE: '.alert, .notice, [class*="flash"], [class*="alert"]',

  /** Sign out link selector */
  SIGN_OUT_LINK: 'a[href*="sign_out"]:has-text("Sign out"), a:has-text("Sign out")',

  /** Generic submit button selector */
  SUBMIT_BUTTON: 'input[type="submit"], button[type="submit"]',
} as const;

/**
 * Registration page selectors
 */
export const REGISTER = {
  /** Name input field */
  NAME_INPUT: '#user_name, input[name="user[name]"]',

  /** Email input field */
  EMAIL_INPUT: '#user_email, input[name="user[email]"]',

  /** Password input field */
  PASSWORD_INPUT: '#user_password, input[name="user[password]"]',

  /** Password confirmation input field */
  PASSWORD_CONFIRM: '#user_password_confirmation, input[name="user[password_confirmation]"]',

  /** Submit button */
  SUBMIT_BUTTON: 'input[type="submit"], button[type="submit"]',

  /** Error message containers */
  ERROR_MESSAGES: '.field_with_errors, #error_explanation, [class*="error"]',
} as const;

/**
 * Login page selectors
 */
export const LOGIN = {
  /** Email input field */
  EMAIL_INPUT: '#user_email, input[name="user[email]"]',

  /** Password input field */
  PASSWORD_INPUT: '#user_password, input[name="user[password]"]',

  /** Submit button */
  SUBMIT_BUTTON: 'input[type="submit"], button[type="submit"]',
} as const;

/**
 * Campaigns page selectors
 */
export const CAMPAIGNS = {
  /** New/Add Campaign link */
  NEW_CAMPAIGN_LINK: 'a[href*="campaigns/new"], a:has-text("Add New Campaign"), a:has-text("New Campaign"), a:has-text("New campaign")',

  /** Campaign title input field */
  TITLE_INPUT: '#campaign_title, input[name="campaign[title]"], input[name="campaign[name]"]',

  /** Campaign description input field */
  DESCRIPTION_INPUT: '#campaign_description, textarea[name="campaign[description]"], input[name="campaign[description]"]',

  /** Submit button */
  SUBMIT_BUTTON: 'input[type="submit"], button[type="submit"]',

  /** Campaign row/card container */
  CAMPAIGN_ROW: 'tr, .campaign, li',

  /** Edit link within a campaign row */
  EDIT_LINK: 'a:has-text("Edit"), a[href*="edit"]',

  /** Delete/Destroy button/link */
  DELETE_BUTTON: 'a:has-text("Delete"), a:has-text("Destroy"), button:has-text("Delete")',
} as const;

/**
 * User account management selectors
 */
export const ACCOUNT = {
  /** Cancel/Delete account button */
  DELETE_ACCOUNT_BUTTON: 'a:has-text("Cancel my account"), button:has-text("Cancel my account")',
} as const;

/**
 * All selectors grouped together for easy import
 */
export const SELECTORS = {
  COMMON,
  REGISTER,
  LOGIN,
  CAMPAIGNS,
  ACCOUNT,
} as const;

