# Type spec: decision (transcript of truth)

A decision record captures **why the system is the way it is**: the pivotal choices, what was rejected, and when. It is append-mostly history that is still load-bearing — when it stops being true of the code, it gets superseded or archived, not silently edited.

## Contract

- **Status line required**, first thing after the title: state emoji + one-sentence state + the dating that anchors it (ship date, ticket, MR).
- **Scope line**: the code surfaces the decision governs.
- **Deferral boilerplate**: one line pointing current-state readers elsewhere ("Current state lives in <architecture doc / apex>; chronology lives in git/MR history. This is the record of the pivotal choices.").
- **Decisions as bold-headline bullets.** Each: the choice, the load-bearing rationale, and the **rejected alternative(s)** when one was seriously considered. The rejected-alternative clause is what future re-proposals collide with — never cut it for brevity.
- **Append-mostly.** A decision that changed gets a dated addendum or a supersession pointer; rewriting the original erases the transcript. (Blockquote callouts at the top for "one pivot of N survives"-style drift notes.)
- **Slim.** Compression versus the source plan should be severe; phase plans, open questions, and implementation mechanics do not belong here.

## Section order (default)

1. Title — `# <Decision> — <kind> record`
2. **Status** / **Scope** / deferral boilerplate (bold-labeled lines)
3. Optional drift callout (blockquote) when part of the original decision has since moved
4. `## Decisions` — the bold-headline bullets
5. Optional `## Supersedes / defers` — what this record replaced and what it consciously pushed elsewhere (with pointers)

## Review checklist

- [ ] Status line present, dated, honest (verify the claim against git/tickets if stale-looking)
- [ ] Deferral boilerplate points at a live current-state doc
- [ ] Every decision bullet carries its why; rejected alternatives preserved
- [ ] Nothing present-tense-mechanical that belongs in an architecture doc
- [ ] Edits were appends/addenda, not silent rewrites of recorded choices
