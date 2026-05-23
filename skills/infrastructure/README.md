# Infrastructure Skills

Skills for GitLab CI/CD operations, merge request documentation, and Terraform plan analysis. All three are designed to work together on a typical GitLab + Terraform infrastructure workflow.

## Skills

| Skill | Role | Use when |
|---|---|---|
| [`gitlab-ci-inspector`](gitlab-ci-inspector/SKILL.md) | Diagnostic | Fetching and diagnosing GitLab CI/CD job logs from a URL |
| [`gitlab-mr-writing`](gitlab-mr-writing/SKILL.md) | Specialist | Writing MR descriptions and technical reviewer guides |
| [`terraform-plan-summary`](terraform-plan-summary/SKILL.md) | Specialist | Summarizing Terraform plan output from CI logs or pasted output |

## Typical workflow

1. CI pipeline runs → `gitlab-ci-inspector` to fetch and read the logs
2. Plan job contains Terraform output → `terraform-plan-summary` to extract the impact
3. Change is ready to merge → `gitlab-mr-writing` to document it
