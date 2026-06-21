# Type spec: plan (active work)

A plan directs work that has not finished. Its contract optimizes for two readers: the implementer mid-work, and the future triager deciding whether it's still alive.

## Contract

- **Status line required and dated**, first thing after the title — refreshed (status-only) before each commit that advances the work. An undated or stale status line is how plans rot into context poison.
- **Origin line**: the ticket(s) and any cross-repo design-of-record pointers.
- **Locked decisions section** near the top: choices already made, as bold-headline bullets — so iteration doesn't relitigate them. (These are the future decision record's raw material.)
- **Work breakdown in lettered/numbered chunks**, each anchored to concrete files/symbols, each independently checkable. Mark completion state inline (✅ / 🟡 / not started).
- **Verification section**: how the work will be proven, from unit commands to live checks.
- **Out-of-scope / follow-ups section**: named exclusions with where they're tracked.
- **Diagrams encouraged** for proposed flows — same mermaid strictness rules as architecture docs.
- **Lifecycle expectation**: a plan ends in promotion (architecture/decision rewrites) and/or verbatim archive. Write it knowing the locked-decisions and breakdown sections are what get harvested.

## Section order (default)

1. Title — `# Plan: <the work>`
2. **Status (dated)** / **Origin** / **Scope**
3. Context / problem (brief; bullets)
4. Locked decisions
5. Diagrams (current vs proposed, when shape changes)
6. Work breakdown (lettered)
7. Acceptance criteria / verification
8. Risks / open items
9. Out of scope / follow-ups

## Review checklist

- [ ] Status line dated and matching reality (git/MR check on anything that smells shipped)
- [ ] Locked decisions separated from open questions
- [ ] Every work item names its files/symbols
- [ ] Verification section exists and is executable as written
- [ ] Out-of-scope items have tracking pointers
- [ ] Diagrams (if any) validated through a strict renderer
