---
name: workflow-fit
description: Rates how well each of six multi-agent workflow patterns fits a given task (0-10 with grounded reasons) and recommends a composite orchestration. Use when the user asks "which workflow pattern", "rate the workflow patterns", "pick a workflow pattern for this", "how should we orchestrate this", "what pattern fits this task", wants to choose between classify/fanout/verify/generate/tournament/loop before spawning agents, or says "ultracode" and wants to choose the right harness first.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: developer-workflow
  triggers: which workflow pattern, rate the workflow patterns, pick a workflow pattern for this, how should we orchestrate this, what pattern fits this task, choose an orchestration pattern, ultracode pattern selection
  role: specialist
  scope: implementation
  output-format: markdown
  related-skills: deep-research, write-a-skill
---

# Workflow Fit

Given a task, rate the applicability of six multi-agent workflow patterns, then recommend a composite. The composite is the deliverable — single patterns rarely win alone, they compose. Characterize the task FIRST; rate only against that characterization.

## The six patterns

| Pattern | Combats | Core shape |
|---|---|---|
| **Classify-And-Act** | goal drift in heterogeneous streams | classifier routes each item to a specialist |
| **Fanout-And-Synthesize** | agentic laziness, goal drift | split by dimension, parallel agents, barrier synthesizer |
| **Adversarial Verification** | self-preferential bias | worker output challenged by independent refuters |
| **Generate-And-Filter** | coverage gaps | many generators → rubric+dedupe filter |
| **Tournament** | self-preferential bias on wide-open choices | N agents compete, pairwise judging until winner |
| **Loop Until Done** | agentic laziness on unknown-size tasks | outer harness; stop when a round surfaces nothing new |

## Step 0 — Should I use a workflow at all?

Check all three. If all are "no," a workflow is overkill — the default harness will do.

- Does the task exceed one context window's capacity for coverage or quality?
- Is the dominant failure risk **agentic laziness** (stops early), **self-preferential bias** (grades own output charitably), or **goal drift** (drifts from original objective across compaction)?
- Is the task high-value enough to justify the token cost?

Proceed only if at least one "yes."

## Step 1 — Characterize the task

Pin down four axes before rating anything.

- **Artifact type** — falsifiable claims (verifiable against ground truth)? open design space? heterogeneous incoming stream? unknown-size discovery surface?
- **Epistemic state** — settled decisions (job = harden) or open (job = explore)?
- **Coverage shape** — enumerable dimensions/components/lenses, or unbounded?
- **Failure mode** — what does plausible-but-wrong cost downstream?

## Step 2 — Rate each pattern 0-10

Scores must follow from the Step 1 answers.

- **Classify-And-Act** — high ONLY for heterogeneous incoming work needing routing; near-zero for a single known task. Three valid variants: classify-at-start (routing), classify-at-end (output-quality tier), model-routing (Sonnet vs. Opus). See [REFERENCE.md](REFERENCE.md).
- **Fanout-And-Synthesize** — high when coverage across enumerable dimensions exceeds one context; weakness — finds but does not pressure-test, so it pairs as the front half of Adversarial Verification.
- **Adversarial Verification** — high when the output decomposes into falsifiable claims and plausible-but-wrong is the dominant failure mode; verifiers must be prompted to refute and to default to "refuted" when uncertain.
- **Generate-And-Filter** — medium when the need is new surface (edge cases, ideas) filtered by a rubric; a supplement, not a spine.
- **Tournament** — high only when the solution space is wide open and competing whole attempts are affordable; ACTIVELY WRONG when decisions are settled — relitigates closed choices.
- **Loop Until Done** — an OUTER harness whose only value is its stop condition; wasteful standalone. Wrap it around Fanout/Verify when discovery size is unknown.

## Step 3 — Output: ratings table, then the composite

Produce a table — `Pattern | Score /10 | Failure mode targeted | Why` — where every Why is grounded in the Step 1 characterization.

Then state the **RECOMMENDED COMPOSITE**: which patterns chain, in what order, which one is the outer harness. Check [REFERENCE.md](REFERENCE.md) first — use a named canonical composite as the starting point rather than assembling from scratch.

**Token budget:** If the composite is expensive (fanout + adversarial verify + loop), suggest the user set a budget before running: prompt with "use Xk tokens" or set `budget.total` in the workflow script.

Close by offering to run it.

## Anti-patterns

**DO NOT** rate without characterizing the task first — scores with no Step 1 grounding are noise.

**DO NOT** recommend Tournament over settled decisions — it relitigates closed choices.

**DO NOT** ship Fanout findings unverified when the artifact is falsifiable claims.

**DO NOT** recommend Loop Until Done as a standalone core — outer harness only.

**DO NOT** hand back a ratings table without a recommended composite.

**DO NOT** let agents that read untrusted public content take high-privilege actions — apply the quarantine modifier. See [REFERENCE.md](REFERENCE.md).

See [EXAMPLES.md](EXAMPLES.md) for two worked examples.
