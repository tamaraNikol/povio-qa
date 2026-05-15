# Custom Playwright Matchers

This directory contains custom Playwright matchers for domain-specific assertions that make tests more readable and maintainable.

## Available Matchers

### `toHaveCampaignVisible(title: string)`
Checks if a campaign with the given title is visible on the page.

**Usage:**
```typescript
await expect(page).toHaveCampaignVisible('My Campaign Title');
```

**Traditional equivalent:**
```typescript
await expect(page.locator(`text="${title}"`).first()).toBeVisible({ timeout: 8000 });
```

### `toShowSuccessMessage(pattern: RegExp)`
Checks if a success/flash message matching the pattern is shown.

**Usage:**
```typescript
await expect(page).toShowSuccessMessage(/created|success/i);
```

**Traditional equivalent:**
```typescript
const flash = page.locator('.alert, .notice, [class*="flash"]');
const text = await flash.textContent();
expect(text).toMatch(/created|success/i);
```

### `toShowFlashMessage()`
Checks if any flash/alert message is visible on the page.

**Usage:**
```typescript
await expect(page).toShowFlashMessage();
```

**Traditional equivalent:**
```typescript
const flash = page.locator('.alert, .notice, [class*="flash"]');
await expect(flash).toBeVisible({ timeout: 3000 });
```

## How It Works

1. **Implementation**: `custom-matchers.ts` - Contains the matcher implementations
2. **Type Definitions**: `custom-matchers.d.ts` - TypeScript declarations for IDE autocomplete
3. **Initialization**: Matchers are automatically initialized in `fixtures/test-fixtures.ts`

## Benefits

- **More Readable Tests**: Domain-specific language makes tests easier to understand
- **Better Error Messages**: Custom error messages provide clearer failure reasons
- **DRY Principle**: Reduces code duplication across test files
- **Maintainability**: Changes to assertions can be made in one place
- **Type Safety**: Full TypeScript support with autocomplete

## Example Tests

See `tests/custom-matchers.example.spec.ts` for complete examples of how to use these matchers in real test scenarios.

## Adding New Matchers

To add a new custom matcher:

1. Add the implementation in `custom-matchers.ts`:
   ```typescript
   expect.extend({
     async yourNewMatcher(page: Page, param: string) {
       // Implementation
       return {
         message: (): string => 'your error message',
         pass: true/false,
       };
     },
   });
   ```

2. Add the type definition in `custom-matchers.d.ts`:
   ```typescript
   interface Matchers<R, T> {
     yourNewMatcher(param: string): R;
   }
   ```

3. The matcher will automatically be available in all tests!

