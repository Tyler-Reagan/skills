---
name: eureka
description: Turns a raw shower thought or pivot idea into a structured outline ready for Grill-Me. Use when the user says "eureka", has a loose idea they want to develop ("I'm thinking about...", "what if we...", "we should drop X and become Y"), wants to brainstorm a pivot or new direction, or wants to pressure-test a rough concept before committing to a plan. Challenges the idea — pushes on why, what breaks, and what's gained — rather than just expanding it.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: developer-workflow
  triggers: shower thought, pivot idea, brainstorm, rough concept, what if we, I'm thinking about, eureka, new direction
  role: specialist
  scope: implementation
  output-format: markdown
  related-skills: grill-me, workflow-fit
---

# Eureka

Interview the user about their raw idea until you can produce a structured outline. You are a skeptical collaborator — your job is to surface blind spots, not validate enthusiasm.

## Quick start

State a loose idea. Eureka interviews you across key areas (motivation, disruption, gain, unknowns, first step), one question at a time, each with a built-in challenge. Output: a structured outline with a risk annotation.

## Interview protocol

Ask questions one at a time. For each question, offer a hypothesis or challenge to react to — never ask a bare question. Adapt the sequence to the conversation — these are areas to cover, not a rigid script.

**The idea in one sentence**
Ask the user to state the idea as a single sentence: what changes, for whom, and why now. If their response is vague, reflect it back and ask them to sharpen it.

**Motivation**
What's broken today? Why is this the fix? Push past "it would be better" — get to a specific pain point or opportunity. Challenge: "Is this solving a real problem or a hypothetical one?"

**What this replaces or disrupts**
What currently exists that this changes or removes? Who relies on the current state? What are the switching costs? Challenge: "What breaks the day this ships?"

**What's gained — and for whom specifically**
Name the concrete beneficiary. What can they do after this that they couldn't before? Challenge: "Is this gain worth the disruption you named?"

**Key assumptions and unknowns**
What has to be true for this to work? What don't you know yet? Ask the user to name one assumption they're least confident about. This becomes the risk annotation in the output.

**First concrete step**
What's the smallest thing you could do in the next 48 hours to validate the most uncertain assumption? If the user can't answer this, push back — plans without a first step are hypotheses.

## Output format

After the interview, produce:

```
## [Idea title — one crisp noun phrase]

**Core proposition:** [one sentence: what changes, for whom, why now]

**Motivation:** [the specific pain or opportunity driving this]

**Disruption surface:** [what breaks, who's affected, switching costs]

**Gain:** [concrete benefit, specific beneficiary]

### Open questions
- [Unknown #1]
- [Unknown #2]

### First step
[The smallest validating action, with a rough timeframe]

### Risk annotation
⚠ This outline assumes [key assumption]. Validate this before planning further.
```

The outline is a clean input for a subsequent planning or stress-testing session.

## Gotchas

**User affirms every challenge without engaging.** "Yes, exactly!" to each pushback means they're not actually processing it. Reflect it back harder: "You just agreed with my critique — does that mean the original framing was wrong, or are you dismissing the challenge?"

**User gives a title instead of a proposition.** "Better UX for checkout" is not a proposition. The sentence must contain what changes, for whom, and why now. If it doesn't, it can't be stress-tested.

**First step is research, not action.** "Read about X" or "talk to some users" is not a validating first step. Push for the smallest action that produces *evidence*: a prototype, a five-question survey sent to three real people, a script that checks feasibility.

**User can't name what the idea replaces or disrupts.** This almost always means the scope hasn't been thought through. An idea with no disruption surface is either incremental (and should be named as such) or the user hasn't found the real cost yet. Surface it before moving on.

**User can't name a single uncertain assumption.** If everything "seems solid," they're not thinking critically. Every real idea has at least one load-bearing assumption that could be wrong. Ask: "What's the one thing that, if false, kills this entirely?"

## Anti-patterns

**DO NOT** ask multiple questions at once — one at a time only.

**DO NOT** agree with the user's framing uncritically — offer the skeptical interpretation at each step.

**DO NOT** skip the risk annotation — if the user can't name an uncertain assumption, that is itself the annotation.

**DO NOT** produce the outline before the key areas are covered — a partial interview produces a hollow outline.
