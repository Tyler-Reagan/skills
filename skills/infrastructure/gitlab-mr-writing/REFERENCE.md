# GitLab MR Writing — Reference

## Body craft

### Opening sentence rules

- States what the MR accomplishes at a systems level — end-state, not process
- One to two sentences maximum
- No "This MR..." opener — start with the subject directly
- Examples:
  - ✓ "Canonical orchestration boundary is now explicit across all loader paths."
  - ✗ "This MR refactors the orchestration layer to make the boundary explicit."

### Theme group labels

- Bold, present-tense noun phrase ending with colon
- Order: architecture/structural changes first, then operational, then cleanup
- Examples: `Cross-version orchestration convergence:`, `Operational and quality outcomes:`, `Codebase cleanup:`

### Bullet rules

- Start with a verb or direct noun reference — no filler
- Reference real file paths, function names, and module names in backticks when relevant
- One idea per bullet; do not combine unrelated points
- Use em-dash (`—`) to separate subject from consequence when needed
- Never use "we", "our", "the team", or passive voice
- State end-states as facts, not as descriptions of what changed

### Multi-package MRs

Write a separate titled section per repo/package (`## viewer-shared`, `## viewer (desktop)`, etc.), each with its own title and description block.

---

## Technical Reviewer Guide

Generate only for Architectural-class changes when the user requests it.

### Header block

```markdown
**Baseline:** branch point with `main` (`merge-base(origin/main, HEAD)` = `<sha>`)
**Range reviewed:** `<merge-base-sha>..<head-sha>`
**Scope:** `<package>/<subdirectory>/*`
```

Copy the `Suggested Reviewer Header` from the diff summary script output verbatim.

### Body structure

```markdown
## End-State Delta From Main

### 1) [Short declarative title]

- [Bullet: specific end-state fact]
- [Bullet: specific end-state fact]

### 2) [Short declarative title]

...

## Reviewer Focus Areas

- [Validation checkpoint — Confirm/Validate/Verify language]
- [Validation checkpoint]
```

### Numbered section rules

- Title is a short declarative statement in present or past tense: "Canonical orchestration boundary is now explicit"
- 2–5 bullets per section; each describes a concrete, verifiable end-state fact
- Reference specific files, exports, and function names
- No narrative — state facts only

### Reviewer Focus Areas

- 4–6 bullets maximum
- Action verbs: `Confirm`, `Validate`, `Verify`
- Each item maps to a risk area the reviewer should actively check
- Focus on: contract stability, cross-domain isolation, regression surface, behavioral parity

---

## Tone and style

| Do | Don't |
|---|---|
| Reference real file paths and function names | Use vague abstractions ("the service", "the helper") |
| State end-states as facts | Describe intermediate steps or history |
| Use active, direct language | Use passive voice |
| Trust the diff — say what's NOT obvious | Restate what the diff already shows file-by-file |
| Match technical depth to the audience | Over-explain well-known concepts |
| Limit brittle references (plan docs, etc.) | Add cross-doc paths that rot when files move |
