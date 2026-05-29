---
name: gitlab-ci-inspector
description: Fetches and diagnoses GitLab CI/CD job logs using glab CLI or the REST API. Use when the user shares a gitlab.com job or pipeline URL, asks "why did my pipeline fail", "what does this CI job say", or "check the build logs" — accepts job URLs, pipeline URLs, or project + job name pairs.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.0.0"
  domain: infrastructure
  triggers: GitLab job URL, pipeline URL, CI job, pipeline failed, build logs, glab, GITLAB_TOKEN
  role: diagnostic
  scope: troubleshooting
  output-format: text
  related-skills: gitlab-mr-writing, terraform-plan-summary
---

# GitLab CI Inspector

Fetch and analyze GitLab CI/CD job logs and pipeline status. Accepts job URLs, pipeline URLs, or project + job identifiers.

## Input Parsing

Extract identifiers from whatever the user provides:

| Input format             | Example                                            | Extract                                     |
| ------------------------ | -------------------------------------------------- | ------------------------------------------- |
| Job URL                  | `https://gitlab.com/group/project/-/jobs/123`      | project path + job ID                       |
| Pipeline URL             | `https://gitlab.com/group/project/-/pipelines/456` | project path + pipeline ID (then list jobs) |
| Project + job name + ref | `group/cloud/api-service`, `deploy_dev`, `main`    | search pipelines for matching job           |

**URL parsing patterns:**

```
Job URL:      https://gitlab.com/<PROJECT_PATH>/-/jobs/<JOB_ID>
Pipeline URL: https://gitlab.com/<PROJECT_PATH>/-/pipelines/<PIPELINE_ID>
```

The `PROJECT_PATH` may contain multiple segments (e.g., `group/cloud/runner-svc`). URL-encode it as `group%2Fcloud%2Frunner-svc` for API calls.

## Authentication

### Tier 2: glab CLI (preferred)

```bash
which glab && glab auth status
```

If not installed: `brew install glab` (macOS) then `glab auth login`.

### Tier 3: GitLab REST API (fallback)

Requires `GITLAB_TOKEN` env var or in project `.env` file.

```bash
# Test token
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/user" | jq .username
```

If no token exists, guide the user:

1. Go to https://gitlab.com/-/user_settings/personal_access_tokens
2. Create a token with `read_api` scope
3. `export GITLAB_TOKEN=glpat-...` (or add to shell profile)

## Workflow

### Step 1: Resolve to a job ID

**From a job URL** — job ID is in the URL, proceed to Step 2.

**From a pipeline URL** — list jobs in that pipeline:

```bash
# glab (Tier 2) — run from a clone of the target project
glab ci list --pipeline <PIPELINE_ID>

# REST API (Tier 3)
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/pipelines/<PIPELINE_ID>/jobs" \
  | jq '.[] | {id, name, status, stage}'
```

**From project + job name** — find the latest pipeline, then the job:

```bash
# Latest pipeline for a ref
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/pipelines?ref=<BRANCH>&per_page=1" \
  | jq '.[0].id'
```

### Step 2: Fetch job metadata

```bash
# glab (Tier 2)
glab ci view <JOB_ID>

# REST API (Tier 3)
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>" \
  | jq '{id, name, status, stage, started_at, finished_at, duration, runner, web_url, pipeline: .pipeline.id, ref: .ref, commit: .commit.short_id}'
```

### Step 3: Fetch job log

```bash
# glab (Tier 2)
glab ci trace <JOB_ID>

# REST API (Tier 3) — returns plain text
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/trace"
```

Job logs can be large. When using the API, pipe through `tail -n 200` for a quick look at the end (where errors typically appear), or search for error patterns:

```bash
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/trace" \
  | grep -i -E "(error|fatal|fail|denied|timeout|exit code)" | head -30
```

### Step 4: Analyze and summarize

Present findings as:

1. **Job status**: passed / failed / canceled / timed out
2. **Duration**: how long it ran
3. **Key output**: relevant build artifacts, image tags pushed, terraform plans
4. **Errors**: extracted error messages with context
5. **Root cause hint**: likely explanation based on error patterns

**Pre-delivery checklist:**

- [ ] Job ID confirmed (not a pipeline ID or job name alone)
- [ ] Status, duration, and branch/ref stated
- [ ] Error messages quoted verbatim, not paraphrased
- [ ] Root cause maps to a known error pattern, or explicitly flagged as unknown
- [ ] Artifacts listed if the job produced any

## Common Error Patterns

| Log pattern                                       | Likely cause                                            |
| ------------------------------------------------- | ------------------------------------------------------- |
| `Error: Unsupported Terraform Core version`       | CI `TERRAFORM_VERSION` doesn't match `required_version` |
| `Waiting for rollout to finish: 0 replicas Ready` | Pod crash, image pull failure, or scheduling issue      |
| `ImagePullBackOff` / `ErrImagePull`               | Image doesn't exist in registry or auth failure         |
| `AccessDeniedException`                           | Wrong IAM role/profile or missing permissions           |
| `exit code 1` (docker build)                      | Dockerfile build failure — check lines above            |
| `denied: Your authorization token has expired`    | ECR login expired mid-push                              |

## Anti-Patterns

**DO NOT** attempt log analysis before resolving to a specific job ID — pipeline IDs and job names are not job IDs; resolve first.

**DO NOT** dump raw log output at the user — always structure findings as status → duration → key output → errors → root cause.

**DO NOT** skip glab CLI and jump straight to the REST API — try glab first; it handles auth automatically and is far simpler.

**DO NOT** forget to URL-encode the project path in REST API calls (`group/subgroup/project` → `group%2Fsubgroup%2Fproject`).

**DO NOT** paraphrase error messages — quote them verbatim so the user can grep or search for them.

## Artifacts

If the job produces artifacts, list and download them:

```bash
# List artifacts
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/artifacts" \
  -o artifacts.zip

# Or just check if artifacts exist
curl -s -I --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/artifacts" \
  | head -5
```
