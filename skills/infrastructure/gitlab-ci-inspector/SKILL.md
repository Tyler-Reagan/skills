---
name: gitlab-ci-inspector
description: Fetches and diagnoses GitLab CI/CD job logs using glab CLI or the REST API. Use when the user shares a gitlab.com job or pipeline URL, asks "why did my pipeline fail", "what does this CI job say", or "check the build logs" — accepts job URLs, pipeline URLs, or project + job name pairs.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: infrastructure
  triggers: GitLab job URL, pipeline URL, CI job, pipeline failed, build logs, glab, GITLAB_TOKEN
  role: diagnostic
  scope: troubleshooting
  output-format: text
  related-skills: gitlab-mr-writing, terraform-plan-summary
---

# GitLab CI Inspector

Fetch and analyze GitLab CI/CD job logs. Try glab CLI first — it handles auth automatically and needs no URL-encoding. Fall back to the REST API only if glab is unavailable. See [REFERENCE.md](REFERENCE.md) for REST API commands, advanced project+name lookup, and the full error pattern catalogue.

## Input Parsing

| Input format | Example | Extract |
|---|---|---|
| Job URL | `https://gitlab.com/group/project/-/jobs/123` | project path + job ID |
| Pipeline URL | `https://gitlab.com/group/project/-/pipelines/456` | project path + pipeline ID → then list jobs |
| Project + job name + ref | `group/cloud/api-service`, `deploy_dev`, `main` | search pipelines for matching job |

The `PROJECT_PATH` may contain multiple segments. URL-encode it (`group%2Fsubgroup%2Fproject`) for REST API calls — glab handles this automatically.

## Authentication

**glab (preferred):** run from within a local clone of the target project.
```bash
which glab && glab auth status
# Not installed: brew install glab && glab auth login
```

**REST API fallback:** requires `GITLAB_TOKEN`. See [REFERENCE.md](REFERENCE.md) for token setup.

## Workflow

### Step 1 — Resolve to a job ID

**From a job URL** — job ID is in the URL; proceed to Step 2.

**From a pipeline URL:**
```bash
glab ci list --pipeline <PIPELINE_ID>
```

**From project + job name** — see [REFERENCE.md](REFERENCE.md) for pipeline search commands.

### Step 2 — Fetch job metadata
```bash
glab ci view <JOB_ID>
```

### Step 3 — Fetch and scan the log
```bash
# Tail first — errors appear at the end
glab ci trace <JOB_ID> | tail -n 200

# Or grep for errors directly
glab ci trace <JOB_ID> | grep -i -E "(error|fatal|fail|denied|timeout|exit code)" | head -30
```

### Step 4 — Analyze and summarize

Present findings as:
1. **Status** — passed / failed / canceled / timed out
2. **Duration** — how long it ran
3. **Errors** — quoted verbatim with context
4. **Root cause** — map to a known pattern (see [REFERENCE.md](REFERENCE.md)) or flag as unknown
5. **Artifacts** — note any produced (image tags, terraform plans, packages)

**Pre-delivery checklist:**
- [ ] Job ID confirmed (not a pipeline ID or job name alone)
- [ ] Status, duration, and branch/ref stated
- [ ] Error messages quoted verbatim, not paraphrased
- [ ] Root cause mapped to a known pattern or explicitly flagged as unknown

## Gotchas

**glab must run from a clone of the target project.** `glab ci list` and `glab ci trace` resolve the project from the git remote. Running from an unrelated directory either errors with "no remote" or silently inspects the wrong project.

**Pipeline ID ≠ Job ID.** A pipeline URL gives you a pipeline ID — you still need to list jobs in that pipeline to get a job ID before you can trace it. Mixing them produces 404s that look like auth failures.

**URL-encoding is mandatory for REST API project paths.** `group/subgroup/project` must be `group%2Fsubgroup%2Fproject` in API calls. A literal `/` returns a 404. glab handles this transparently; the REST API does not.

**Logs are large; tail first.** Errors appear at the end of failed job logs. Always start with `tail -n 200` or the grep pattern — only fetch the full log if the error isn't in the tail.

## Anti-Patterns

**DO NOT** attempt analysis before resolving to a specific job ID — pipeline IDs and job names are not job IDs.

**DO NOT** dump raw log output — structure findings as status → duration → errors → root cause.

**DO NOT** skip glab and jump to the REST API — glab is simpler and handles auth automatically.

**DO NOT** paraphrase error messages — quote them verbatim so the user can grep or search.
