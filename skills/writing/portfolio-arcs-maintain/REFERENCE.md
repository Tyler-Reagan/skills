# Maintain — absorb vs novel

Load during the absorb gate. Defaults favor **update-in-place**.

## Disposition table

| Situation | Disposition | Action |
| --- | --- | --- |
| Extends an existing skill thesis | **Absorb** | Patch owning card Spine/Shipped/Outcome + linked studies |
| Strengthens a breakout more than the top | **Absorb** | Patch that breakout (+ substrate); keep **budget** |
| Real work, not differentiating | **Deferred** or **omit** | `deferred/` note or skip — no new card |
| Suite story shifts, same project thesis | **Absorb** | Refresh suite project card + arc index; still one S-card |
| New fence, new Owned surface, or new product altitude no Skill line can hold | **Novel** | Route to history → highlights; do not author here |
| Would drown the collection top if folded in | Try breakout absorb first; if no breakout slot and budget full | **Grill** fold vs deferred vs novelty — do not silent-add a fourth card |

## Novelty bar

Clears only when **all** are true:

1. No existing Skill line can absorb the work without becoming a feature dump or
   violating a sibling **fence**.
2. The work would be a distinct interview screen a hiring manager would open
   separately (not “also shipped !N”).
3. The user accepts that packaging may require **collapse** elsewhere to hold
   **budget** — or an explicit budget exception.

If (1) fails → absorb. If (2) fails → deferred/omit. If (3) is refused → deferred
or absorb at lower altitude (substrate-only mention), not a new highlight.

## Absorb gate (record form)

Before creating any new `cards/` or `case-studies/` file (including in a routed
authoring session), write:

```text
Intake: {MR/issue or summary}
Tried Skill lines: {codes + one-line theses}
Absorb? no — {why altitude/fence breaks}
Novelty bar: clear | blocked
Next: update-in-place | deferred | /portfolio-arcs-from-history
```

## What to patch (absorb)

| Artifact | Touch | Leave alone |
| --- | --- | --- |
| Highlight | Spine (exemplars), Shipped, Outcome, Ownership if agency shifted | Skill thesis rename unless the screen truly changed |
| Case study | Spine / What shipped / Outcome enough to back the card | Full rewrite unless thesis moved |
| Collection README | Skill map evidence handles, timelines | Card budget / codes |
| Suite README | Arc index one-liners, phase spine if climax moved | Second project card |

## Out of scope

- Greenfield collection or suite (authoring skills)
- Public sanitize / publish mirrors
- Replacing `/portfolio-swe-highlights` collapse waves (user invokes that skill)
