# Age Field Bug Fix and ASCII Background Enhancement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix age field UX by auto-selecting default value on focus and add ASCII finance symbols background across page and modals.

**Architecture:** Two independent features: (1) Add onFocus handler to age input for text selection; (2) Create CSS background pattern with SVG data URI and apply to main container and modal dialog.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vite

---

## File Structure

**Files to modify:**
- `src/components/InvestorForm.tsx:174-183` - Age input component
- `src/index.css` - Add ASCII background CSS classes
- `src/pages/Index.tsx:130` - Main container div
- `src/components/ResultsModal.tsx:42` - Modal DialogContent

**No new files created.**

---

### Task 1: Age Field Bug Fix

**Files:**
- Modify: `src/components/InvestorForm.tsx:174-183`

- [ ] **Step 1: Examine current age input code**

Check lines 174-183 in InvestorForm.tsx to confirm current structure:
```tsx
<Input
  type="number"
  value={profile.age}
  onChange={handleAgeChange}
  onBlur={handleAgeBlur}
  className="bg-muted/50 flex-1"
  min="18"
  max="120"
  step="1"
/>
```

- [ ] **Step 2: Add onFocus handler**

Edit the Input component to add auto-selection:
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

- [ ] **Step 3: Verify syntax and formatting**

Check that the component still has proper formatting and no syntax errors:
- Closing bracket on correct line
- No missing commas
- Proper indentation

- [ ] **Step 4: Run TypeScript type check**

Run: `npm run type-check` or `tsc --noEmit`
Expected: No type errors

- [ ] **Step 5: Commit age field fix**

```bash
git add src/components/InvestorForm.tsx
git commit -m "feat: auto-select age field on focus for better UX"
```

---

### Task 2: ASCII Finance Symbols Background - CSS

**Files:**
- Modify: `src/index.css` (add at end of file)

- [ ] **Step 1: Add ASCII background CSS classes**

Add to end of `src/index.css` (after line 160):
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

- [ ] **Step 2: Verify CSS syntax**

Check for:
- Proper URL encoding
- Correct hex colors (`%23000000` = black, `%23ffffff` = white)
- Correct opacity values (0.03 for light, 0.05 for dark)

- [ ] **Step 3: Test CSS build**

Run: `npm run build` or check that Vite dev server doesn't show CSS errors
Expected: Build succeeds without CSS parsing errors

- [ ] **Step 4: Commit CSS changes**

```bash
git add src/index.css
git commit -m "feat: add ASCII finance symbols background CSS"
```

---

### Task 3: ASCII Background - Apply to Main Page

**Files:**
- Modify: `src/pages/Index.tsx:130`

- [ ] **Step 1: Locate main container div**

Find line 130 in Index.tsx:
```tsx
<div className="min-h-screen bg-background">
```

- [ ] **Step 2: Add background class**

Add `ascii-finance-bg` class:
```tsx
<div className="min-h-screen bg-background ascii-finance-bg">
```

- [ ] **Step 3: Verify class ordering**

Ensure `bg-background` remains (provides solid color) and `ascii-finance-bg` adds pattern on top.

- [ ] **Step 4: Check for visual conflicts**

Look for other background-related classes on the same element (none expected).

- [ ] **Step 5: Commit main page background**

```bash
git add src/pages/Index.tsx
git commit -m "feat: apply ASCII background to main page"
```

---

### Task 4: ASCII Background - Apply to Modal

**Files:**
- Modify: `src/components/ResultsModal.tsx:42`

- [ ] **Step 1: Locate DialogContent component**

Find line 42 in ResultsModal.tsx:
```tsx
<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto sm:max-w-[95vw] sm:max-h-[85vh] px-0 sm:px-0">
```

- [ ] **Step 2: Add background class**

Add `ascii-finance-bg` to className:
```tsx
<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto sm:max-w-[95vw] sm:max-h-[85vh] px-0 sm:px-0 ascii-finance-bg">
```

- [ ] **Step 3: Check z-index and layering**

Ensure modal content remains readable with background pattern (opacity is very low).

- [ ] **Step 4: Verify modal still functions**

Check that modal opens/closes correctly (no layout shifts).

- [ ] **Step 5: Commit modal background**

```bash
git add src/components/ResultsModal.tsx
git commit -m "feat: apply ASCII background to results modal"
```

---

### Task 5: Integration Testing

**Files:** All modified files

- [ ] **Step 1: Run full test suite**

Run: `npm test` or check if tests pass
Expected: All existing tests pass

- [ ] **Step 2: Type check all files**

Run: `npm run type-check` or `tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 3: Build verification**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 4: Visual inspection (manual)**

Start dev server: `npm run dev`
Check:
1. Age field auto-selects "18" when clicked
2. ASCII pattern visible on main page (subtle in light mode)
3. ASCII pattern visible in modal (subtle in light mode)
4. Dark mode toggles pattern opacity correctly
5. Readability maintained with low opacity

- [ ] **Step 5: Final commit with testing summary**

```bash
git add -u
git commit -m "test: verify age field fix and ASCII background integration"
```

---

## Rollback Plan

**If age field fix causes issues:**
1. Remove `onFocus={(e) => e.target.select()}` from InvestorForm.tsx
2. Revert to original implementation

**If ASCII background causes visual issues:**
1. Remove `ascii-finance-bg` class from Index.tsx and ResultsModal.tsx
2. Remove CSS from index.css
3. Fallback to plain background

**Testing after rollback:**
- Verify age field works with original behavior
- Verify no background pattern remains
- Ensure all tests still pass