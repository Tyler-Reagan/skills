# Workflow Fit — Reference

## Canonical composites

Named stacks from common use cases. Match the task against these before assembling a custom composite.

| Stack | Patterns | Use when |
|---|---|---|
| **Research** | Fanout → Adversarial Verify (outer: Loop-Until-Dry) | Claims verification against a corpus or codebase |
| **Verification** | Fanout claims → Adversarial Verify per claim | Fact-check a document; one verifier per claim |
| **Sorting** | Tournament (pairwise) | Qualitative ranking at scale; pairwise more reliable than absolute scoring |
| **Root-cause** | Fanout by evidence source → Tournament of hypotheses → Adversarial Verify survivors | Debugging, post-mortems, incident analysis |
| **Triage** | Classify-And-Act → Generate-And-Filter (dedupe) → Loop Until Done | Queues, bug backlogs, support tickets at scale |
| **Exploration** | Generate-And-Filter → Tournament | Taste-based design, naming, approach selection |
| **Migration** | Fanout per callsite/module → Adversarial Verify each fix (worktree isolation) | Refactors, renames, codebase-wide changes |
| **Memory mining** | Fanout over sessions → Classify-And-Act → Adversarial Verify candidates | Distilling CLAUDE.md rules from session corrections |

---

## Classify-And-Act variants

Three distinct shapes with different score profiles:

| Variant | Shape | Score high when |
|---|---|---|
| **Classify-at-start** | Classifier routes each incoming item to a specialist agent | Input is a heterogeneous stream with distinct item types |
| **Classify-at-end** | Worker produces output; classifier determines quality tier or output format | Output has enumerable quality or category tiers |
| **Model routing** | Classifier does pre-research, then routes to Sonnet vs. Opus | Task complexity is unknowable upfront; routing research is cheap relative to running the wrong model |

---

## Quarantine modifier

Apply to any Triage composite where agents read untrusted public content (user submissions, scraped data, web results, uploaded files):

- **Reader agents** — access untrusted content, produce structured summaries only; no filesystem writes, no API calls with side effects
- **Actor agents** — receive only the reader's structured summary, never the raw untrusted content; execute all high-privilege actions

This prevents prompt injection in untrusted content from reaching agents that can take real-world actions.
