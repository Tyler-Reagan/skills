---
name: terraform-plan-summary
description: Parses Terraform plan output or GitLab CI job logs into a concise infrastructure impact summary. Use when the user pastes a terraform plan, shares a CI job log with plan output, asks "what would this change", "summarize the plan", or "what gets destroyed" — strips GitLab runner noise and ANSI escapes automatically.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: infrastructure
  triggers: terraform plan, CI plan job, what would this change, summarize the plan, what gets destroyed, plan output
  role: specialist
  scope: analysis
  output-format: markdown
  related-skills: gitlab-ci-inspector
---

# Terraform Plan Summary

Produce a **short, scannable summary** of infrastructure impact from a Terraform plan log. Not a replay of refresh noise — only what changes.

## Step 1 — Normalize the log

1. Strip GitLab runner prefixes: lines often start with an ISO timestamp + stream code + space (`2026-04-01T16:50:55Z 01O `). Remove everything up to and including the trailing space.
2. Strip ANSI escape sequences: remove `\x1b[...m` patterns (or literal `[0m`, `[32m`, etc.).
3. **Ignore entirely** (not plan content): `Refreshing state...`, `Reading...`, `Read complete after`, `terraform init`, provider downloads, module init, backend messages, Docker/yum/git submodule output.

For a quick one-liner to pre-clean before pasting, see [REFERENCE.md](REFERENCE.md#machine-assisted-parsing).

## Step 2 — Detect multiple plans in one job

CI jobs often run several `terraform plan` invocations sequentially. Treat each block as a separate subsection. Use the most recent preceding `echo "..."` or distinctive script line as the subsection label (e.g. `Terraform plan for dev deployment`, `Auth0 tenant terraform plan`).

## Step 3 — Extract resource-level actions

Match lines (after normalization):
```
  # <address> will be created
  # <address> will be destroyed
  # <address> will be updated in-place
  # <address> must be replaced
```

| Phrase | Label |
|---|---|
| will be created | add |
| will be destroyed | destroy |
| will be updated in-place | change (in-place) |
| must be replaced | replace (destroy + create) |

## Step 4 — Group repetitive resources

If many addresses share the same resource type and change kind, state the count and pattern once, list at most 3 examples, then `… and N more similar`. **Never group destroys or replacements** — list those explicitly regardless of count.

## Step 5 — Attribute changes (when user needs depth)

Pull `~ attribute = … ->` lines showing before/after. Prefer: `image`, `version`, `cidr`, `policy`, `arn`, `name`, `replicas`, `enabled`. For identical changes across many resources, state once: "All N deployments: image `old` → `new`".

## Step 6 — Warnings and errors

Summarize `Warning:` blocks (count + first line + resource if shown). Call out `Error:` / `╷` diagnostic blocks with the primary message — do not omit failures.

Keep the final output **under ~40 lines** unless the user asks for full resource enumeration. Use the output template in [REFERENCE.md](REFERENCE.md#output-template).

## Gotchas

**`must be replaced` is a destroy + create, not just a change.** It counts as both a deletion and a creation — list it under replacements, never lump it with in-place changes. Replacements can cause downtime and dependency failures that ordinary changes cannot.

**`No changes` doesn't mean no warnings.** A plan can output `No changes. Your infrastructure matches the configuration.` and still contain a `Warning:` block. Always scan for warnings even when the resource change count is zero.

**Multiple plans in one job can be hard to delimit without echo headers.** If echo labels are absent, look for the `Initializing the backend...` / `Initializing provider plugins...` boundary as a subsection divider.

**GitLab runner prefix format varies by runner version.** The `01O` stream code or similar may differ across runner configurations. Use a lenient regex that anchors on the ISO timestamp pattern rather than the exact stream code suffix.

## Anti-Patterns

**DO NOT** include refresh noise (`Refreshing state...`, `Reading...`, provider init) — not plan content.

**DO NOT** group destroys or replacements — always list them explicitly and fully.

**DO NOT** exceed ~40 lines unless the user asks for full enumeration.

**DO NOT** describe configuration intent — describe what infrastructure will change. Delta, not intent.

**DO NOT** omit section labels when a job runs multiple plans — head each subsection with its CI echo label.
