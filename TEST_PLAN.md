# Test Plan — Upcoming Features

**Project:** Povio Automation Testing Application  
**Document Version:** 1.1  
**Date:** May 2026  
**Author:** Tamara Nikolesku 
**Status:** Ready for Review

---

## Executive Summary

This test plan provides comprehensive test coverage for three major upcoming features in the Povio Automation Testing Application. The plan includes 28 detailed test cases organized by priority, risk analysis, and clear entry/exit criteria. It is designed to be actionable for QA engineers, understandable for developers, and transparent for product managers.

---

## 1. Introduction

This test plan covers three upcoming features for the Povio AT application:
1. **Roles and Permissions** — Administrator role with campaign deletion
2. **User List** — Admin-visible user management panel
3. **Campaign Images** — Optional image upload with thumbnail display

The plan is designed to be understood by developers, QA engineers, and product managers alike.

---

## 2. Scope

### In Scope
- Functional testing of all new features described below
- Role-based access control validation
- UI/UX validation (correct elements shown/hidden per role)
- Edge cases and negative test scenarios
- API-level validation where applicable

### Out of Scope
- Performance/load testing
- Existing features not touched by these changes
- Mobile-specific layout testing (unless explicitly required)

---

## 3. Assumptions and Risks

| # | Assumption / Risk | Impact | Mitigation |
|---|---|---|---|
| 1 | Admin role is assigned manually (no self-promotion UI yet) | Medium | Seed a test admin account in test setup |
| 2 | "Delete campaign" is irreversible | High | Confirm with dev whether soft-delete or hard-delete |
| 3 | Image upload supports common formats (JPEG, PNG, GIF, WebP) | Medium | Clarify accepted MIME types |
| 4 | Max image file size not yet defined | Medium | Test with large files; clarify limit |
| 5 | Promotion/demotion is instant (no email confirmation) | Low | Validate UI reflects change immediately |
| 6 | Regular users cannot access the user list route directly | High | Test direct URL access as non-admin |

---

## 4. Feature 1 — Roles and Permissions

### 4.1 Overview
An **Administrator** role is introduced. Admins can delete campaigns. Regular users cannot.

### 4.2 Test Cases

#### TC-RP-01 — Admin can delete a campaign
- **Preconditions:** Logged in as admin; at least one campaign exists
- **Steps:** Navigate to campaign list → locate a campaign → click Delete
- **Expected:** Campaign is deleted; confirmation message shown; campaign no longer appears in list

#### TC-RP-02 — Delete button is visible only to admin
- **Preconditions:** Two sessions — one admin, one regular user
- **Steps:** Both users view the same campaign list
- **Expected:** Admin sees Delete button; regular user does NOT see Delete button

#### TC-RP-03 — Regular user cannot delete via direct URL/API
- **Preconditions:** Logged in as regular user; campaign ID known
- **Steps:** Send DELETE request to `/campaigns/:id` directly
- **Expected:** 403 Forbidden or redirect with error; campaign NOT deleted

#### TC-RP-04 — Unauthenticated user cannot delete
- **Preconditions:** Not logged in
- **Steps:** Send DELETE request to `/campaigns/:id`
- **Expected:** Redirect to login or 401 Unauthorized

#### TC-RP-05 — Admin cannot delete a non-existent campaign
- **Preconditions:** Logged in as admin
- **Steps:** Send DELETE to `/campaigns/99999` (non-existent ID)
- **Expected:** 404 Not Found; no crash

#### TC-RP-06 — Admin can delete campaigns created by other users
- **Preconditions:** Campaign created by regular user; admin is logged in
- **Steps:** Admin deletes that campaign
- **Expected:** Campaign is deleted successfully

---

## 5. Feature 2 — User List

### 5.1 Overview
Admins see a user list with name, email, and role. A button allows promoting or demoting users.

### 5.2 Test Cases

#### TC-UL-01 — Admin can view user list
- **Preconditions:** Logged in as admin; multiple users exist
- **Steps:** Navigate to user list page
- **Expected:** Table/list shows all users with name, email, and role columns

#### TC-UL-02 — Regular user cannot access user list
- **Preconditions:** Logged in as regular user
- **Steps:** Navigate to `/users` or user list URL
- **Expected:** Access denied (403) or redirect away; user list NOT displayed

#### TC-UL-03 — Unauthenticated user cannot access user list
- **Preconditions:** Not logged in
- **Steps:** Navigate to user list URL
- **Expected:** Redirect to login

#### TC-UL-04 — Admin can promote regular user to admin
- **Preconditions:** Logged in as admin; regular user exists
- **Steps:** Click "Promote to Admin" next to target user
- **Expected:** User's role updates to Admin in the list; button changes to "Demote"

#### TC-UL-05 — Admin can demote admin to regular user
- **Preconditions:** Logged in as admin; another admin user exists
- **Steps:** Click "Demote" next to target admin
- **Expected:** Role changes to regular user in the list; button changes to "Promote"

#### TC-UL-06 — Admin cannot demote themselves
- **Preconditions:** Logged in as admin
- **Steps:** View own row in user list
- **Expected:** No promote/demote button for own account, OR button is disabled with tooltip

#### TC-UL-07 — Promoted user gains admin privileges immediately
- **Preconditions:** Regular user is promoted by admin
- **Steps:** Promoted user logs out and back in (or refreshes session)
- **Expected:** User can now see Delete buttons on campaigns and access user list

#### TC-UL-08 — Demoted user loses admin privileges immediately
- **Preconditions:** Admin is demoted by another admin
- **Steps:** Demoted user refreshes or revisits protected pages
- **Expected:** Access to admin features is revoked

#### TC-UL-09 — User list displays correct data for all users
- **Preconditions:** Known set of users with known names/emails/roles
- **Steps:** Admin views user list
- **Expected:** Each row matches the corresponding user's actual data

---

## 6. Feature 3 — Campaign Images

### 6.1 Overview
Campaigns can optionally include an image. The campaign list shows a thumbnail if an image is present.

### 6.2 Test Cases

#### TC-CI-01 — User can create a campaign with an image
- **Preconditions:** Logged in as regular user
- **Steps:** Create new campaign → upload a valid image (JPEG) → submit
- **Expected:** Campaign created successfully; image associated with campaign

#### TC-CI-02 — Thumbnail appears in campaign list for campaigns with images
- **Preconditions:** Campaign with image exists
- **Steps:** Navigate to campaign list
- **Expected:** Thumbnail `<img>` element visible in the row/card for that campaign

#### TC-CI-03 — No thumbnail for campaigns without images
- **Preconditions:** Campaign created without an image
- **Steps:** Navigate to campaign list
- **Expected:** No broken image icon; placeholder or empty space shown consistently

#### TC-CI-04 — Image upload accepts valid formats (JPEG, PNG, WebP)
- **Preconditions:** Logged in; on campaign form
- **Steps:** Upload one valid file per format
- **Expected:** Each upload accepted; thumbnail visible after save

#### TC-CI-05 — Image upload rejects invalid file types
- **Preconditions:** Logged in; on campaign form
- **Steps:** Attempt to upload a `.exe`, `.pdf`, or `.txt` file
- **Expected:** Error message shown; campaign not saved with invalid file

#### TC-CI-06 — Oversized image is rejected
- **Preconditions:** Logged in; on campaign form; file larger than max allowed size (TBD)
- **Steps:** Upload a file exceeding the size limit
- **Expected:** Meaningful error message shown; upload rejected

#### TC-CI-07 — User can add an image to an existing campaign
- **Preconditions:** Campaign exists without an image
- **Steps:** Edit campaign → upload image → save
- **Expected:** Image now associated; thumbnail visible in list

#### TC-CI-08 — User can remove an image from a campaign
- **Preconditions:** Campaign with image exists
- **Steps:** Edit campaign → remove/clear image → save
- **Expected:** Image removed; no thumbnail in list view

#### TC-CI-09 — Thumbnail loads without broken image on slow connection
- **Preconditions:** Campaign with image exists (simulate slow network if possible)
- **Steps:** Navigate to campaign list
- **Expected:** Image loads correctly; no broken icon shown during load (loading state handled)

#### TC-CI-10 — Thumbnail dimensions are reasonable
- **Preconditions:** Campaign with a very large image (e.g. 4000×3000px)
- **Steps:** View campaign list
- **Expected:** Thumbnail is scaled to a small, consistent size; layout is not broken

---

## 7. Test Environment

| Environment | URL | Notes |
|---|---|---|
| Staging | https://povio-at.herokuapp.com | Primary test environment |
| Local | http://localhost:3000 | Developer testing |

**Test Accounts to Provision:**
- `admin@test.com` — Admin role (to be seeded)
- `user@test.com` — Regular user
- Dynamically generated users per test run for isolation

---

## 8. Entry and Exit Criteria

**Entry Criteria:**
- Feature branch deployed to staging
- Developer confirms feature is ready for QA
- Test accounts provisioned

**Exit Criteria:**
- All Critical and High priority test cases pass
- No open P1/P2 bugs
- Test report generated and shared

---

## 9. Priority Matrix

| Priority | Test Cases |
|---|---|
| Critical | TC-RP-01, TC-RP-03, TC-UL-02, TC-UL-03, TC-UL-07, TC-UL-08 |
| High | TC-RP-02, TC-RP-04, TC-UL-01, TC-UL-04, TC-UL-05, TC-CI-01, TC-CI-02, TC-CI-05 |
| Medium | TC-RP-05, TC-RP-06, TC-UL-06, TC-UL-09, TC-CI-03, TC-CI-04, TC-CI-06, TC-CI-07, TC-CI-08 |
| Low | TC-CI-09, TC-CI-10 |

---

## 10. Quick Reference

### Test Case Summary

| Feature | Total Test Cases | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| Roles and Permissions | 6 | 2 | 2 | 2 | 0 |
| User List | 9 | 4 | 3 | 2 | 0 |
| Campaign Images | 10 | 0 | 3 | 5 | 2 |
| **Total** | **28** | **6** | **8** | **9** | **2** |

### Testing Approach

- **Manual Testing:** Initial exploratory testing for edge cases
- **Automated Testing:** All test cases will be automated using Playwright
- **API Testing:** Backend validation for access control (TC-RP-03, TC-RP-04, TC-UL-02, TC-UL-03)
- **Cross-Browser:** Chrome, Firefox, Safari (desktop)
- **Accessibility:** Basic keyboard navigation and screen reader compatibility checks

### Dependencies

| Feature | Dependencies |
|---|---|
| Roles and Permissions | Backend: Admin role model, authentication middleware |
| User List | Backend: User management API endpoints |
| Campaign Images | Backend: File upload handling, image storage service |

### Test Data Requirements

- **Admin accounts:** Minimum 2 (to test preventing self-demotion)
- **Regular user accounts:** Minimum 5 (for user list display testing)
- **Test campaigns:** Minimum 10 (some with creators from different users)
- **Test images:** Various formats (JPEG, PNG, WebP, GIF), various sizes (small, medium, oversized)

---

## Appendix A: Open Questions

1. **Image Storage:** Are images stored in a database or external service (e.g., S3, Cloudinary)?
2. **Image Optimization:** Are uploaded images automatically optimized/compressed?
3. **Audit Trail:** Is there logging for role changes and campaign deletions?
4. **Soft Delete:** Are deleted campaigns recoverable or permanently removed?
5. **Bulk Operations:** Will admins be able to delete multiple campaigns at once?
6. **Rate Limiting:** Are there rate limits on role promotion/demotion actions?

---

## Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025 | QA Engineer | Initial draft |
| 1.1 | May 2026 | QA Engineer | Updated with quick reference, test summary, and open questions |

---

**End of Test Plan**

