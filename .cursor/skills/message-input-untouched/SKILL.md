---
name: message-input-untouched
description: Never modify MessageInput components, reply bars, or chat input boxes in either the main chat pane (general chat pane) or Slackbot panel when creating new content. These components must remain completely untouched with exact padding and gap consistency preserved. Input boxes are permanent structural elements that must survive all state transitions unchanged. Use when creating new content, modifying existing screens, rebuilding components, or building any Slack experience to ensure input boxes are never altered and consistency is maintained.
---

# Message Input Untouched - Permanent Structural Elements

## Critical Architectural Rule

**Message input boxes are PERMANENT STRUCTURAL ELEMENTS, not content. They must survive every state transition completely unchanged. They are siblings to the scrollable content area, never children of it.**

## Critical Rule

**When creating new content or modifying existing components, NEVER modify MessageInput components, reply bars, or chat input boxes in either pane. The padding and gaps between the two input boxes MUST remain perfectly matched and consistent across ALL Slack experiences. Input boxes must NEVER be conditional, hidden, removed, or restyled during any state transition.**

## Scope - Both Panes Must Match

This applies to **TWO** message input boxes that must have **IDENTICAL** padding and gaps:

1. **General Chat Pane (Main Chat / Left/Center Pane)**
   - The message input box at the bottom of the Slack DM thread
   - Any `MessageInput` component used in `Arc1SlackThread.tsx`, `Scene1SlackFeed.tsx`, or similar chat components
   - The input bar styling, padding, structure, or functionality
   - **MUST match the Slackbot panel input box exactly**

2. **Slackbot Panel (Right Pane)**
   - The reply bar at the bottom of the Slackbot panel
   - Any `MessageInput` component or reply bar used in `Arc1AgentforcePanel.tsx`, `SlackbotPanel.tsx`, or similar panel components
   - The reply bar styling, padding, structure, or functionality
   - **MUST match the general chat pane input box exactly**

## Exact Padding & Gap Specifications

The following values were carefully matched and must NEVER be changed:

### MessageInput Component Internal Padding
- **Form element**: `paddingBottom: "2px"` (inline style)
- **Input wrapper**: `px-3 py-3` (12px horizontal, 12px vertical)

### Wrapper Around MessageInput
- **Outer wrapper padding**: `p-3` (12px all sides)
- **Background**: `bg-white`
- **Border**: `border-t` with `borderColor: "#e8e8e8"` or `T.colors.border`

### Reply Bar (Alternative Format in Slackbot Panel)
- **Outer container**: `border: "1px solid #E0E0E0"`, `borderRadius: "12px"`, `padding: "10px 14px"`
- **Placeholder to icons gap**: Minimal vertical spacing (tight layout)
- **Icon row padding**: Consistent with container padding

### Consistency Requirements
- Both input boxes must have **identical** vertical padding
- Both input boxes must have **identical** horizontal padding
- Both input boxes must have **identical** gaps between elements
- Both input boxes must have **identical** bottom spacing
- The visual appearance must be **pixel-perfect** match

## What This Means

When creating or modifying content:

- ✅ **DO**: Create new components, add new screens, modify panel content, update state management
- ✅ **DO**: Modify the content area, headers, cards, buttons, or other UI elements
- ❌ **DON'T**: Change `MessageInput` component props, styling, or structure
- ❌ **DON'T**: Modify the wrapper divs around message inputs
- ❌ **DON'T**: Adjust padding, margins, or spacing of input boxes (even by 1px)
- ❌ **DON'T**: Change placeholder text, icons, or input functionality
- ❌ **DON'T**: Add or remove input-related components
- ❌ **DON'T**: Use different padding values in different panes
- ❌ **DON'T**: Break the consistency between general chat pane and Slackbot panel

## Examples

### ❌ Bad - Breaking Consistency

```typescript
// DON'T do this - different padding in different panes
// General Chat Pane
<div className="p-4">  // ❌ Changed from p-3
  <MessageInput ... />
</div>

// Slackbot Panel
<div className="p-3">
  <MessageInput ... />
</div>
```

### ❌ Bad - Modifying Input Box

```typescript
// DON'T do this when creating new content
<div className="p-3">
  <MessageInput
    placeholder="New placeholder"  // ❌ Changed placeholder
    onSubmit={handleSubmit}
    value={inputValue}
    onChange={setInputValue}
    className="new-class"  // ❌ Added new class
  />
</div>
```

### ✅ Good - Preserving Exact Consistency

```typescript
// DO this - use EXACT same structure and padding in both panes

// General Chat Pane
<div className="shrink-0 border-t bg-white" style={{ borderColor: "#e8e8e8" }}>
  <div className="p-3">
    <MessageInput
      placeholder="Message Slackbot..."
      onSubmit={handleSubmit}
      value={inputValue}
      onChange={setInputValue}
    />
  </div>
</div>

// Slackbot Panel - MUST MATCH EXACTLY
<div className="shrink-0 border-t bg-white" style={{ borderColor: "#e8e8e8" }}>
  <div className="p-3">
    <MessageInput
      placeholder="Message Slackbot..."
      onSubmit={handleSubmit}
      value={inputValue}
      onChange={setInputValue}
    />
  </div>
</div>
```

## Examples

### ❌ Bad - Modifying Input Box

```typescript
// DON'T do this when creating new content
<div className="p-3">
  <MessageInput
    placeholder="New placeholder"  // ❌ Changed placeholder
    onSubmit={handleSubmit}
    value={inputValue}
    onChange={setInputValue}
    className="new-class"  // ❌ Added new class
  />
</div>
```

### ✅ Good - Leaving Input Box Untouched

```typescript
// DO this - leave the input box exactly as it was
<div className="p-3">
  <MessageInput
    placeholder="Message Slackbot..."
    onSubmit={handleSubmit}
    value={inputValue}
    onChange={setInputValue}
  />
</div>
```

## When This Applies

This rule applies when:

- Creating new screens or components
- Rebuilding existing screens
- Adding new content to panels
- Modifying state management or data flow
- Updating styling or layout of other components
- Implementing new features or flows
- **Building ANY Slack experience** (Arc 1, Arc 2, Scene 1, Scene 2, etc.)
- **Creating new prototype screens** or flows

## Universal Application

This consistency must be maintained across **ALL** Slack experiences:

- ✅ Arc 1 (Arc1SlackThread + Arc1AgentforcePanel)
- ✅ Arc 2, Arc 3, etc. (all future arcs)
- ✅ Scene 1 (Scene1SlackFeed + SlackbotPanel)
- ✅ Scene 2, Scene 3, etc. (all future scenes)
- ✅ Any new Slack prototype or demo experience

**Every time you create a new Slack experience, ensure BOTH panes have message input boxes with IDENTICAL padding and gaps.**

## Exception

The ONLY time you may modify message input boxes is when the user **explicitly requests** changes to them (e.g., "change the placeholder text" or "adjust the padding of the input box"). Even then:
- Make minimal, targeted changes only
- **Apply the same changes to BOTH panes** to maintain consistency
- Document the new padding/gap values if changed

## Verification Checklist

Before finalizing any changes, verify:

- [ ] No `MessageInput` components were modified
- [ ] No wrapper divs around inputs were changed
- [ ] No padding/margin adjustments were made to input areas (even 1px)
- [ ] Input boxes remain exactly as they were before
- [ ] **Both general chat pane and Slackbot panel have message input boxes**
- [ ] **Both input boxes have IDENTICAL padding values**
- [ ] **Both input boxes have IDENTICAL gap/spacing values**
- [ ] **Visual appearance matches pixel-perfect between both panes**
- [ ] Consistency is maintained across all Slack experiences

## Architectural Pattern - Required Structure

**Input boxes MUST be permanent siblings to content areas, never conditional children:**

### ✅ Correct Architecture

```typescript
// CORRECT: Input box is a permanent sibling, never conditional
<PanelContainer>
  <PanelHeader />       {/* Never touched */}
  <PanelBody>           {/* ONLY this zone swaps between states */}
    {renderContentForState(currentScreen)}
  </PanelBody>
  <PanelInputBox />     {/* Never touched - always present */}
</PanelContainer>
```

### ❌ Wrong Architecture

```typescript
// WRONG: Input box is inside conditional rendering
if (currentScreen === 1) {
  return (
    <div>
      <PanelHeader />
      <PanelBody>Content for screen 1</PanelBody>
      <PanelInputBox />  {/* ❌ Recreated on every state change */}
    </div>
  );
}
if (currentScreen === 2) {
  return (
    <div>
      <PanelHeader />
      <PanelBody>Content for screen 2</PanelBody>
      <PanelInputBox />  {/* ❌ Recreated on every state change */}
    </div>
  );
}
```

### Required Implementation Pattern

```typescript
export function SlackPanel({ currentScreen, ... }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header - Never changes */}
      <PanelHeader />
      
      {/* Body - ONLY this changes with state */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {currentScreen === 1 && <Screen1Content />}
        {currentScreen === 2 && <Screen2Content />}
        {currentScreen === 3 && <Screen3Content />}
      </div>
      
      {/* Input Box - ALWAYS present, never conditional */}
      <div className="shrink-0 border-t bg-white" style={{ borderColor: "#e8e8e8" }}>
        <div className="p-3">
          <MessageInput
            placeholder="Message Slackbot..."
            onSubmit={handleSubmit}
            value={inputValue}
            onChange={setInputValue}
          />
        </div>
      </div>
    </div>
  );
}
```

## State Transition Rules

1. **Input boxes have NO dependency on `currentScreen` or any state variable**
2. **Input boxes are NEVER inside conditional rendering** (`if`, `&&`, `?:`, `display: none`, `opacity: 0`)
3. **Input boxes are NEVER inside the scrollable content area**
4. **Input boxes are ALWAYS siblings to the content area**
5. **When state changes, ONLY the content area re-renders**
6. **Input boxes do NOT fade, move, resize, or disappear during transitions**

## Anti-Patterns to Avoid

### ❌ Conditional Rendering

```typescript
// WRONG - Input box is conditional
{currentScreen !== 5 && (
  <MessageInput ... />
)}
```

### ❌ Inside State-Managed Component

```typescript
// WRONG - Input box inside state-dependent component
<ScreenContent screen={currentScreen}>
  <MessageInput ... />  {/* ❌ Gets recreated */}
</ScreenContent>
```

### ❌ Display/Opacity Manipulation

```typescript
// WRONG - Hiding input box
<div style={{ display: currentScreen === 1 ? 'block' : 'none' }}>
  <MessageInput ... />
</div>
```

### ❌ Inside Scrollable Content

```typescript
// WRONG - Input box inside scrollable area
<div className="flex-1 overflow-y-auto">
  <Content />
  <MessageInput ... />  {/* ❌ Scrolls with content */}
</div>
```

## Reference Implementation

For reference, check these files to see the exact implementation:
- `src/components/shared/MessageInput.tsx` - The component itself (paddingBottom: 2px, px-3 py-3)
- `src/components/presentation/scenes/Arc1SlackThread.tsx` - General chat pane wrapper (p-3)
- `src/components/presentation/scenes/Arc1AgentforcePanel.tsx` - Slackbot panel wrapper (p-3)
- Any other Slack experience files - Must follow the same pattern

**All implementations MUST follow the architectural pattern above.**
