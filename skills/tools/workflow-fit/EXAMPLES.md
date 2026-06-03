# Workflow Fit — Worked Examples

## Example 1 — Hardening a reviewed infrastructure plan

Task: harden a reviewed infrastructure plan whose content is file:line code-behavior claims and already-settled design decisions.

**Step 1 characterization:**
- Artifact type: falsifiable claims (file:line references verifiable against code)
- Epistemic state: settled — design decisions already made
- Coverage shape: enumerable — spans ~5 components
- Failure mode: plausible-but-wrong claim ships to production

| Pattern | Score /10 | Failure mode targeted | Why |
|---|---|---|---|
| Adversarial Verification | 9 | self-preferential bias | The plan is file:line claims — falsifiable against code. Plausible-but-wrong is the dominant risk. |
| Fanout-And-Synthesize | 8 | agentic laziness | The plan spans ~5 components — fan out by lens for coverage. Pairs as front half of Adversarial Verify. |
| Loop Until Done | 6 | agentic laziness | Right as outer stop condition; expect 1–2 rounds before a round comes up dry. |
| Generate-And-Filter | 5 | coverage gaps | Useful only for brainstorming missing failure modes, not hardening existing claims. |
| Tournament | 3 | — | Would relitigate settled design decisions — wrong job. |
| Classify-And-Act | 2 | — | Single known task, nothing to route. |

**Composite:** Fanout-by-lens → Adversarial-Verify, outer: Loop-Until-Dry. Matches the **Research** canonical stack.

---

## Example 2 — Picking a name for a CLI tool

Task: generate and pick the best name for a new CLI tool — taste-based, wide-open solution space, no settled decisions.

**Step 1 characterization:**
- Artifact type: open design space (no ground truth to verify against)
- Epistemic state: open — no settled decisions
- Coverage shape: unbounded idea surface
- Failure mode: naming sticks; low cost but irreversible — diversity of candidates matters before converging

| Pattern | Score /10 | Failure mode targeted | Why |
|---|---|---|---|
| Tournament | 9 | self-preferential bias | Wide-open, taste-based — pairwise judging more reliable than absolute scoring. |
| Generate-And-Filter | 8 | coverage gaps | Unbounded surface; generate a large candidate pool, filter by rubric before the tournament. |
| Fanout-And-Synthesize | 4 | agentic laziness | Useful to fan out by naming style (punchy / descriptive / technical) for diverse candidates; no synthesis barrier needed. |
| Adversarial Verification | 3 | — | No falsifiable claims to refute; output isn't verifiable against ground truth. |
| Loop Until Done | 3 | — | Solution space is bounded once candidates are generated; no unknown amount of work. |
| Classify-And-Act | 1 | — | Single known task, nothing to route. |

**Composite:** Fanout-by-style → Generate-And-Filter → Tournament. Matches the **Exploration** canonical stack.
