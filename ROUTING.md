# Dynamic Version-Based Routing Structure

This document outlines the dynamic routing configuration for the prototype application that automatically works with any version folder (v01, v02, v03, etc.).

## Route Configuration

The routing is configured in `app/routes.js` and uses dynamic version parameters to automatically handle any version folder structure.

### Dynamic Dashboard Routes

- **`/:version/dashboard-deals`** → Renders `{version}/dashboard-deals.html` with `activePage: 'dashboard'`
- **`/:version/dashboard-facilities`** → Renders `{version}/dashboard-facilities.html` with `activePage: 'dashboard'`
- **`/:version/dashboard-reports`** → Renders `{version}/dashboard-reports.html` with `activePage: 'reports'`
- **`/:version/dashboard-profile`** → Renders `{version}/dashboard-profile.html` with `activePage: 'profile'`

### Dynamic Application Details Routes

- **`/:version/application-details/app-details`** → Renders `{version}/application-details/app-details.html` with `activePage: 'dashboard'`

### Change Folder Routes (Amendment Process)

The Change folder contains a 7-page workflow for making amendments to facilities:

#### **Page Flow: 0 → 1 → 2 → 3 → 4 → 5 → 6**

1. **`/:version/Change/change-facility-start`** (Page 0)
   - Initial selection page with checkboxes for what needs to be changed
   - Validates: At least one option must be selected
   - POST: Redirects to next page based on selection

2. **`/:version/Change/change-cover-end-date`** (Page 1)
   - Date input for new cover end date
   - Validates: Day, month, and year must be provided
   - POST: Redirects to facility value page

3. **`/:version/Change/change-facility-value`** (Page 2)
   - Currency input for new facility value
   - Validates: Facility value must be provided
   - POST: Redirects to facility end date question

4. **`/:version/Change/change-facility-end-date`** (Page 3)
   - Radio buttons for facility end date question
   - Validates: Must select Yes or No
   - POST: Redirects to eligibility criteria

5. **`/:version/Change/change-eligibility-criteria`** (Page 4)
   - 7 eligibility criteria with True/False radio buttons
   - Validates: All 7 criteria must be answered
   - POST: Redirects to amendment effective date

6. **`/:version/Change/change-amendment-date`** (Page 5)
   - Date input for when amendment becomes effective
   - Validates: Day, month, and year must be provided
   - POST: Redirects to check answers page

7. **`/:version/Change/change-check-answers`** (Page 6)
   - Final review page using GOV.UK "Check answers" pattern
   - Shows all amendments and eligibility criteria
   - Validates: User must confirm answers checked
   - POST: Redirects to confirmation page

8. **`/:version/Change/change-confirmation`** (Bonus Page)
   - Success confirmation with reference number
   - Links back to dashboard

### Navigation Structure

#### Primary Navigation (Service Navigation)
- Dashboard → `/{version}/dashboard-deals`
- Reports → `/{version}/dashboard-reports`
- Profile → `/{version}/dashboard-profile`

#### Sub-Navigation (Dashboard Pages)
- Deals → `/{version}/dashboard-deals`
- Facilities → `/{version}/dashboard-facilities`

#### Application Links
- Bank Reference cells → `/{version}/application-details/app-details`
- Facility Name cells → `/{version}/application-details/app-details`

#### Change Process Links
- Start amendment process → `/{version}/Change/change-facility-start`
- Each page links to the next in sequence
- Change links on check answers page return to respective input pages

## URL Structure

All URLs use dynamic version parameters:
- **v01**: `/v01/dashboard-deals`, `/v01/Change/change-facility-start`
- **v02**: `/v02/dashboard-deals`, `/v02/Change/change-facility-start`
- **v03**: `/v03/dashboard-deals`, `/v03/Change/change-facility-start`
- **Any version**: `/{version}/dashboard-deals`, `/{version}/Change/change-facility-start`

## Version Parameter

The `:version` parameter automatically captures the version folder name:
- `/v01/...` → `version = 'v01'`
- `/v02/...` → `version = 'v02'`
- `/v03/...` → `version = 'v03'`

## Active Page States

Each route sets an `activePage` variable that controls:
- Navigation highlighting
- `aria-current` attributes
- Active state styling

## Form Validation

All Change folder forms include validation:
- **Error Summary**: Shows at top of page when validation fails
- **Inline Error Messages**: Display below form fields with error styling
- **Field-level Validation**: Each required field is validated individually
- **Navigation Prevention**: Users cannot proceed without valid data

## Catch-all Route

A dynamic catch-all route `/:version/*` handles any undefined routes within a specific version folder and redirects to that version's dashboard.

## Root Route

The root route `/` automatically redirects to `/v01/dashboard-deals` (default version).

## Benefits of Dynamic Versioning

✅ **Automatic Support**: Works with any version folder without code changes
✅ **Scalable**: Easy to add v02, v03, v04, etc.
✅ **Maintainable**: Single routing configuration for all versions
✅ **Consistent**: Same URL patterns across all versions
✅ **Future-proof**: No need to update routes when adding new versions
✅ **Form Validation**: Built-in validation with error handling
✅ **Sequential Navigation**: Logical flow through amendment process

## Example Usage

### Creating v02 folder:
1. Create `app/views/v02/` directory
2. Copy your v01 files to v02
3. Routes automatically work: `/v02/dashboard-deals`, `/v02/Change/change-facility-start`, etc.

### Creating v03 folder:
1. Create `app/views/v03/` directory
2. Copy your v01 files to v03
3. Routes automatically work: `/v03/dashboard-deals`, `/v03/Change/change-facility-start`, etc.

### Amendment Process Flow:
1. Start at `/v01/Change/change-facility-start`
2. Follow sequential navigation through all 7 pages
3. Complete with confirmation at `/v01/Change/change-confirmation`

The routing system will automatically detect and handle any version folder you create, including the complete Change workflow!
