---
name: scatterbrain
description: Focus-recovery skill for when tangential drill-downs have buried the main conversational thread. Use when the user says "scatterbrain", wants to bookmark the current discussion so they can resurface after a tangent, realizes they've lost the thread of what was being discussed, or wants to identify where a session went sideways. Surfaces the drift point and classifies the tangent as productive or derailing before prompting a return to the main thread.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: developer-workflow
  triggers: scatterbrain, lost the thread, drifted, what was I doing, forgot where I was, set anchor, breadcrumb, focus recovery
  role: diagnostic
  scope: troubleshooting
  output-format: text
  related-skills: grill-me, eureka
---

# Scatterbrain

Two modes: **anchor** and **recover**. Detect which mode is needed from context.

## Quick start

**Anchor** — invoke any time in a long session to snapshot the current discussion thread, so you can resurface to it after a tangent.
**Recover** — invoke when you've lost the thread; surfaces the drift point, delta, and a productive-vs-derailing verdict.

## Anchor mode

Triggered when the user wants to bookmark the current conversational thread — in any long session, discussion, or planning sequence.

Snapshot what is being discussed right now:

```
📍 Anchor set
Thread: [what is being discussed or worked on, in one sentence]
Context: [any key decisions or context established so far, if worth preserving]
```

Tell the user: "Anchor set. Call `/scatterbrain` any time to resurface here."

---

## Recover mode

Triggered when the user has drifted and needs to find their thread again.

### Step 1: Find the last anchor or stated goal

Scan the session for:
- An explicit anchor (set in anchor mode)
- The most recent clearly-stated plan, goal, or intention ("I'm going to...", "the goal is...", "let's focus on...")
- The task or problem that opened the session

Report what you found and where in the conversation it appeared.

### Step 2: Map the drift

Identify the **drift point** — the specific moment or exchange where the session departed from that goal. Be precise: name the tool call, question, or decision that started the detour.

Then summarize the **delta**: everything that happened between the anchor and now. Keep it tight — one bullet per meaningful action or decision, not a transcript.

### Step 3: Classify the tangent

Judge whether the drift was:

- **Productive** — you learned something directly relevant to the original goal (a constraint, a dependency, a changed requirement). Name the specific insight gained.
- **Derailing** — you worked on something unrelated to the goal (debugging a config file when you were supposed to be writing a spec, exploring an adjacent feature, chasing a tool error). Name what was lost.

This classification matters. A productive tangent means you should integrate the finding before returning. A derailing tangent means you should return without carrying it forward.

### Step 4: Prompt return

Output the recovery summary:

```
🧭 Last anchor: [goal in one sentence]
📍 Drift point: [the specific moment things went sideways]

Since then:
- [delta bullet]
- [delta bullet]

Verdict: [Productive / Derailing]
[If productive: "Insight to carry forward: [specific finding]"]
[If derailing: "You were working on [topic] — this doesn't need to come with you."]

Here's where you were. Want to return?
```

Wait for the user's confirmation before resuming the original plan.

---

## Anti-patterns

**DO NOT** rewind blindly — always classify the tangent first. Returning without integrating a productive finding wastes work.

**DO NOT** summarize the entire session — focus on the delta between the anchor and now.

**DO NOT** be vague about the drift point — name the exact moment, not "somewhere in the middle."

**DO NOT** set an anchor without confirming the goal is clearly stated — if the user's intent is fuzzy, ask them to sharpen it before anchoring.
