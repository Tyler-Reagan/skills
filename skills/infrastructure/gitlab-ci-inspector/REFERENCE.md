# GitLab CI Inspector — Reference

## REST API authentication setup

Requires `GITLAB_TOKEN` in the environment. If no token exists:

1. Go to https://gitlab.com/-/user_settings/personal_access_tokens
2. Create a token with `read_api` scope
3. `export GITLAB_TOKEN=glpat-...` (or add to shell profile)

Test it:
```bash
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/user" | jq .username
```

---

## REST API workflow commands

Use these as fallback when glab is unavailable. Replace `<URL_ENCODED_PATH>` with the project path using `%2F` instead of `/`.

**List jobs in a pipeline:**
```bash
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/pipelines/<PIPELINE_ID>/jobs" \
  | jq '.[] | {id, name, status, stage}'
```

**Fetch job metadata:**
```bash
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>" \
  | jq '{id, name, status, stage, started_at, finished_at, duration, web_url, pipeline: .pipeline.id, ref: .ref}'
```

**Fetch job log:**
```bash
# Full log (can be large — pipe to tail)
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/trace" \
  | tail -n 200

# Grep for errors
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/trace" \
  | grep -i -E "(error|fatal|fail|denied|timeout|exit code)" | head -30
```

---

## Advanced: resolve job from project + name + ref

```bash
# Step 1: get the latest pipeline ID for a branch
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/pipelines?ref=<BRANCH>&per_page=1" \
  | jq '.[0].id'

# Step 2: find the job by name in that pipeline
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/pipelines/<PIPELINE_ID>/jobs" \
  | jq '.[] | select(.name == "<JOB_NAME>") | .id'
```

---

## Common error patterns

| Log pattern | Likely cause |
|---|---|
| `Error: Unsupported Terraform Core version` | CI `TERRAFORM_VERSION` doesn't match `required_version` in config |
| `Waiting for rollout to finish: 0 replicas Ready` | Pod crash, image pull failure, or scheduling issue |
| `ImagePullBackOff` / `ErrImagePull` | Image doesn't exist in registry or auth failure |
| `AccessDeniedException` | Wrong IAM role/profile or missing permissions |
| `exit code 1` (docker build) | Dockerfile build failure — check lines immediately above |
| `denied: Your authorization token has expired` | ECR login expired mid-push |

---

## Artifacts

Check if a job produced artifacts, and download them:

```bash
# Check artifact existence (HEAD request)
curl -s -I --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/artifacts" \
  | head -5

# Download
curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/<URL_ENCODED_PATH>/jobs/<JOB_ID>/artifacts" \
  -o artifacts.zip
```
