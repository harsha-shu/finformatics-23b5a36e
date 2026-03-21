# Age Field Bug Fix and ASCII Finance Symbols Background Enhancement

## Overview
This spec addresses two UX improvements for the finformatics application:
1. **Age Field Bug**: Poor user experience when entering age due to default value "18" not being auto-selected
2. **Background Enhancement**: Add visually appealing ASCII finance symbols background across page and modals

## Approved Design

### 1. Age Field Bug Fix

**Problem**: When page loads, age field shows "18" as default. Users clicking into the field find cursor at end of "18", requiring manual deletion before typing their age.

**Solution**: Add `onFocus` handler to auto-select all text in age input when focused.

**Implementation Details**:
- File: `src/components/InvestorForm.tsx`
- Line 174-183: Add `onFocus={(e) => e.target.select()}` to age Input component
- Edge cases handled:
  1. Selection occurs only on focus (not every render)
  2. Works with both mouse clicks and keyboard navigation (Tab key)
  3. Compatible with existing validation (min="18", max="120") and blur handler

**Updated Code Snippet**:
```tsx
<Input
  type="number"
  value={profile.age}
  onChange={handleAgeChange}
  onFocus={(e) => e.target.select()}  // NEW: Auto-select on focus
  onBlur={handleAgeBlur}
  className="bg-muted/50 flex-1"
  min="18"
  max="120"
  step="1"
/>
```

**Expected Behavior**:
1. Initial state: Field shows "18"
2. User clicks field: Entire "18" text becomes selected (highlighted)
3. User types "25": "18" is replaced with "25" (no need to delete first)
4. User presses Tab: Field loses focus, validation runs (clamps to 18-120 range)
5. User uses +/- buttons: Works as before, no auto-selection interference

**Testing Strategy**:
1. Manual testing: Click field, verify text selection
2. Keyboard navigation: Tab into field, verify selection
3. Integration: Ensure +/- buttons still work correctly
4. Edge cases: Very young/old ages, invalid inputs

### 2. ASCII Finance Symbols Background Enhancement

**Problem**: Current background is plain and lacks visual interest.

**Solution**: Create CSS background pattern using ASCII finance symbols (`$`, `¥`, `€`, `£`, `₹`, `%`, `↑`, `↓`) as repeating SVG pattern across entire page and modals with low opacity.

**Implementation Details**:
- **File**: `src/index.css` (or new CSS file)
- **Background pattern**: Create SVG pattern with ASCII symbols arranged in grid
- **Opacity control**: Use CSS `opacity: 0.03` (3%) for light mode, `opacity: 0.05` (5%) for dark mode
- **Theme awareness**: Different symbol colors for light/dark modes using CSS custom properties
- **Z-index management**: Ensure pattern stays behind all content

**Symbol Selection**:
```
$ ¥ € £ ₹ % ↑ ↓
$ ¥ € £ ₹ % ↑ ↓
$ ¥ € £ ₹ % ↑ ↓
```

**CSS Implementation**:
```css
/* ASCII finance symbols background */
.ascii-finance-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='20' font-family='monospace' font-size='16' fill='%23000000' opacity='0.03'%3E$ ¥ € £ ₹ % ↑ ↓%3C/text%3E%3Ctext x='10' y='40' font-family='monospace' font-size='16' fill='%23000000' opacity='0.03'%3E$ ¥ € £ ₹ % ↑ ↓%3C/text%3E%3C/svg%3E");
  background-repeat: repeat;
  background-position: center;
}

.dark .ascii-finance-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='20' font-family='monospace' font-size='16' fill='%23ffffff' opacity='0.05'%3E$ ¥ € £ ₹ % ↑ ↓%3C/text%3E%3Ctext x='10' y='40' font-family='monospace' font-size='16' fill='%23ffffff' opacity='0.05'%3E$ ¥ € £ ₹ % ↑ ↓%3C/text%3E%3C/svg%3E");
}
```

**File: `src/pages/Index.tsx`**:
- Apply `.ascii-finance-bg` class to main container div
- Ensure ResultsModal component also receives the background

**Expected Visual Result**:
1. Light mode: Very subtle gray symbols (3% opacity) repeating across entire background
2. Dark mode: Slightly more visible white symbols (5% opacity) for better contrast
3. Readability: Text remains perfectly readable with appropriate contrast ratios
4. Performance: SVG data URI ensures no external asset loading, minimal performance impact

**Testing Strategy**:
1. Visual testing: Verify symbols appear in both themes
2. Readability: Check contrast ratios with foreground text
3. Performance: Ensure no layout shifts or rendering issues
4. Responsive: Works on all screen sizes

## Implementation Order
1. Age field bug fix (simple, isolated change)
2. ASCII background enhancement (CSS changes)

## Success Criteria
- Age field: Users can immediately type over "18" without manual deletion
- Background: Subtle finance-themed pattern visible across page and modals
- No negative impact on existing functionality or performance
- Maintains accessibility and readability standards

## Rollback Plan
- Age fix: Remove `onFocus` handler if issues arise
- Background: Remove CSS class if pattern causes visual or performance issues

---
*Spec approved by user on 2026-03-22*