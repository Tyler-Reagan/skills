# Terraform Plan Summary — Reference

## Output template

```markdown
## Terraform plan summary

### <Section label> (from CI echo or working directory context)

- **Plan**: X add, Y change, Z destroy — _or_ **No changes.**
- **Adds** (count): …
- **Changes** (count): … grouped …
- **Destroys / replaces** (count): …
- **Notable attribute updates**: …
- **Warnings**: …
- **Errors**: …

### <Next section>

…
```

Omit empty sections. Keep total output under ~40 lines unless the user requests full enumeration.

---

## Machine-assisted parsing

Strip GitLab runner noise and ANSI escapes locally before pasting (requires `perl`):

```bash
perl -pe 's/^\d{4}-\d{2}-\d{2}T\S+\s+\S+\s+//; s/\e\[[0-9;]*m//g' job.log > cleaned.log
```

Then extract the key lines:

```bash
rg 'will be (created|destroyed|updated in-place)|must be replaced|^Plan:|No changes\.' cleaned.log
```

---

## Platform example — multi-stack plan job

A typical CI job runs plans for several stacks in sequence:

1. `terraform/aws/dev` — core infrastructure
2. `terraform/auth0/dev-tenant` — identity provider config
3. `terraform/lambda/dev` — serverless functions
4. `terraform/apps/dev-blue` or `dev-green` — application deployments (one path skipped per run based on deploy-color variable)

Expect up to four subsections in the summary. If only three appear, the fourth was intentionally skipped.
