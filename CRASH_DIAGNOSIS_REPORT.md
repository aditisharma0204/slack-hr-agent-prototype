# Development Server Crash Diagnosis Report

## 🔴 CRITICAL BUG FOUND: Infinite Loop in GlobalDMsView.tsx

### Location
`src/components/presentation/GlobalDMsView.tsx` lines 99-106

### The Problem
```typescript
const onDmSelect = propOnDmSelect || setInternalActiveDmId;

useEffect(() => {
  if (!activeDmId && GENERIC_GLOBAL_DMS.length > 0) {
    onDmSelect(GENERIC_GLOBAL_DMS[0].id);
  }
}, [activeDmId, onDmSelect]); // ⚠️ onDmSelect in dependency array
```

### Why This Causes Crashes
1. **Function Reference Instability**: `onDmSelect` is recreated on every render because it's derived from props
2. **Dependency Array Issue**: Including `onDmSelect` in the dependency array means the effect re-runs whenever the function reference changes
3. **Potential Loop**: If `propOnDmSelect` is passed as an inline function or changes reference frequently, this creates an infinite re-render loop
4. **Memory Bloat**: Each re-render triggers HMR (Hot Module Replacement) in dev mode, causing memory to accumulate until Node.js OOM

### The Fix
```typescript
// Use useCallback to stabilize onDmSelect, OR use useRef pattern
const onDmSelectRef = useRef(propOnDmSelect || setInternalActiveDmId);
useEffect(() => {
  onDmSelectRef.current = propOnDmSelect || setInternalActiveDmId;
}, [propOnDmSelect]);

useEffect(() => {
  if (!activeDmId && GENERIC_GLOBAL_DMS.length > 0) {
    onDmSelectRef.current(GENERIC_GLOBAL_DMS[0].id);
  }
}, [activeDmId]); // Remove onDmSelect from deps
```

---

## ⚠️ SECONDARY ISSUES FOUND

### 1. Missing Memory Limit in package.json
**Location**: `package.json` line 6

**Current**:
```json
"dev": "next dev"
```

**Should be**:
```json
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"
```

This increases Node.js memory limit from default (~1.5GB) to 4GB, which helps with HMR memory bloat in dev mode.

### 2. renderContent Function Recreated on Every Render
**Location**: `src/components/presentation/SlackAppShellWrapper.tsx` line 45

The `renderContent` function is recreated on every render. While not causing crashes, it's inefficient. Consider using `useMemo` or `useCallback`.

---

## ✅ GOOD NEWS: Most Code is Stable

The codebase shows good patterns:
- ✅ Proper use of `useRef` for callback stability (see `SlackbotMessagesTab.tsx`)
- ✅ Empty dependency arrays where appropriate (see `WinRateCard.tsx`)
- ✅ Proper cleanup functions in useEffect hooks
- ✅ No obvious memory leaks in animation components

---

## 🚀 HEROKU/VERCEL REALITY CHECK

### Will Publishing to Heroku/Vercel Stop the Crashes?

**YES, but for the wrong reason.**

### Why Production Works Better

1. **No HMR (Hot Module Replacement)**
   - Dev mode (`npm run dev`) uses HMR which keeps old module instances in memory
   - Production (`npm run build`) creates static bundles, no HMR overhead
   - **This is why dev crashes but production won't**

2. **Different Build Process**
   - Dev: Continuous compilation + HMR = memory bloat over time
   - Production: One-time build = fixed memory usage

3. **Memory Limits**
   - Heroku/Vercel production: Runs `npm run build` (one-time) then `npm start` (static server)
   - Your local dev: Runs `npm run dev` (continuous compilation)
   - Production servers have more memory allocated

### The Truth
- ✅ **Production will work** because there's no HMR
- ⚠️ **But the bug still exists** - it just won't manifest in production
- 🔧 **You should still fix it** because:
  - Dev experience will remain broken
  - Future developers will hit the same issue
  - It's a code quality issue

---

## 🧪 THE ACID TEST COMMAND

Run this locally to simulate production:

```bash
npm run build && npm run start
```

**What this does:**
- `npm run build`: Creates optimized production bundles (no HMR)
- `npm run start`: Serves the static build (minimal memory usage)

**Expected result:**
- ✅ Should run without crashing
- ✅ Confirms the bug is dev-mode specific (HMR related)
- ✅ Proves production deployment will work

**If this crashes too:**
- Then you have a deeper issue (likely in the build process itself)
- Check for circular dependencies or import issues

---

## 📋 RECOMMENDED ACTION PLAN

### Immediate (Fix the Crash)
1. **Fix GlobalDMsView.tsx** - Use `useRef` pattern for `onDmSelect`
2. **Add memory limit** to `package.json` dev script
3. **Test locally** with `npm run build && npm run start`

### Short-term (Code Quality)
1. Wrap `renderContent` in `useCallback` in `SlackAppShellWrapper.tsx`
2. Add ESLint rule: `react-hooks/exhaustive-deps` (already in Next.js config)
3. Run `npm run lint` to catch similar issues

### Long-term (Prevention)
1. Consider using React DevTools Profiler to catch re-render issues early
2. Add memory monitoring in dev mode (optional)
3. Document HMR memory limitations for team

---

## 🔍 HOW TO VERIFY THE FIX

After applying the fix:

1. **Start dev server**: `npm run dev`
2. **Navigate to DMs view** (where GlobalDMsView renders)
3. **Watch terminal** - should NOT show continuous re-renders
4. **Check browser console** - should NOT show React warnings about infinite loops
5. **Monitor memory** (optional): `top` or Activity Monitor - should stabilize

If crashes persist after fix, the issue is elsewhere (check other useEffect hooks).

---

## 📊 SUMMARY

| Issue | Severity | Impact | Fix Priority |
|-------|----------|--------|--------------|
| GlobalDMsView infinite loop | 🔴 Critical | Dev server crashes | **FIX NOW** |
| Missing memory limit | 🟡 Medium | Dev server crashes (secondary) | Fix soon |
| renderContent recreation | 🟢 Low | Performance only | Nice to have |

**Bottom Line**: Fix the `GlobalDMsView.tsx` bug, add memory limit, and you should be good. Production deployment will work regardless, but fixing the bug improves dev experience.
