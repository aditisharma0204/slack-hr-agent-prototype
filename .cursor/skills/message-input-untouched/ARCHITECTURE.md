# Message Input Architecture - Required Pattern

## Global Constraint

**Input boxes are PERMANENT STRUCTURAL ELEMENTS that survive ALL state transitions unchanged.**

## Required Component Structure

```typescript
export function SlackPanel({ currentScreen, ... }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header - PERMANENT, never changes */}
      <PanelHeader />
      
      {/* Body - ONLY this changes with state */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {currentScreen === 1 && <Screen1Content />}
        {currentScreen === 2 && <Screen2Content />}
        {currentScreen === 3 && <Screen3Content />}
      </div>
      
      {/* Input Box - PERMANENT, always present, never conditional */}
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

## Anti-Patterns - NEVER DO THIS

### ❌ Conditional Returns with Input Box Inside

```typescript
// WRONG - Input box recreated on every state change
if (currentScreen === 1) {
  return (
    <div>
      <Header />
      <Body>Screen 1</Body>
      <InputBox />  {/* ❌ Recreated */}
    </div>
  );
}
if (currentScreen === 2) {
  return (
    <div>
      <Header />
      <Body>Screen 2</Body>
      <InputBox />  {/* ❌ Recreated */}
    </div>
  );
}
```

### ❌ Conditional Rendering of Input Box

```typescript
// WRONG - Input box is conditional
{currentScreen !== 5 && (
  <MessageInput ... />
)}
```

### ❌ Input Box Inside State-Dependent Component

```typescript
// WRONG - Input box inside conditional content
<div className="flex-1 overflow-y-auto">
  {currentScreen === 1 && (
    <>
      <Screen1Content />
      <MessageInput ... />  {/* ❌ Inside scrollable area */}
    </>
  )}
</div>
```

### ❌ Display/Opacity Manipulation

```typescript
// WRONG - Hiding input box
<div style={{ display: currentScreen === 1 ? 'block' : 'none' }}>
  <MessageInput ... />
</div>
```

## Verification Checklist

Before completing any iteration:

- [ ] Component has a SINGLE return statement
- [ ] Header is a permanent sibling (not conditional)
- [ ] Input box is a permanent sibling (not conditional)
- [ ] Only the body content is conditional
- [ ] Input box is OUTSIDE the scrollable content area
- [ ] Input box has NO dependency on `currentScreen` or any state
- [ ] Input box is NEVER inside an `if` statement
- [ ] Input box is NEVER inside conditional rendering (`&&`, `?:`)
- [ ] Input box does NOT have `display: none` or `opacity: 0`
- [ ] Both panes (main chat + Slackbot panel) follow this pattern

## Implementation Files

All Slack experience components MUST follow this pattern:
- `Arc1AgentforcePanel.tsx`
- `Arc1SlackThread.tsx`
- `Scene1SlackFeed.tsx`
- `SlackbotPanel.tsx`
- Any future Slack experience components
