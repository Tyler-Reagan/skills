# Public nuggets — reference

## Grain (product story)

Default: **one nugget per coherent product story**.

- A suite folder may yield **one** nugget when children are depth of the same story
  (e.g. CytoCanvas multi-surface year).
- A suite may yield **more than one** when children are distinct interview screens
  (e.g. EBC chat product vs isolated compute) — not because card count is high.
- Almost never a second nugget for the *same* story “with more detail.”

Not 1:1 with internal cards, case studies, or collection tops.

## Create vs update

| Op | Precondition | Allowed writes |
| --- | --- | --- |
| **create** | No file for that `id` / story | New `public-portfolio-nuggets/{id}.md` only |
| **update** | File exists | Overwrite that file only |
| **propose** | — | No writes until user confirms rows with create\|update |

Refuse to create during an update-only run. Refuse to overwrite during a
create-only run unless the user explicitly switches op.

When proposing a set, label **each** row create or update — mixed batches OK if
the user confirmed the table.

## Layout

```text
{portfolio-repo}/
├── internal/                      # arcs (source)
└── public-portfolio-nuggets/      # flat *.md nuggets only
    ├── multi-surface-spatial-viz.md
    └── …
```

No parallel suite trees under public. `source` frontmatter is the back-pointer.

## Redact bar

**Allowed:** employer display name; public product vocabulary the company already
uses externally; qualitative outcomes; stack names that are industry-standard.

**Strip / rewrite:**

| Forbidden | Replace with |
| --- | --- |
| Repo paths (`elembio/…`, absolute paths) | Omit or generic “multi-repo” |
| MR/issue ids (`!54`, `SW-…`, GitLab/GitHub URLs) | Omit |
| Tenants, customer names, bucket names | Omit or “customer data” |
| Credentials, tokens, internal hostnames | Omit |
| Org-only codenames / unreleased names | Public synonym or omit |
| Thread dumps, PII | Omit |
| Invented metrics | Qualitative outcome only |

After write, grep touched files for: `elembio/`, `!`, `gitlab`, `s3://`,
`auth0` tenant hosts if internal, `SW-`, `@elembio`.

## Out of scope

- Site components, styling, or card UI
- Resume anchors or resume file edits
- `/portfolio-arcs-maintain` absorbing into nuggets
- Re-mining git (use internal highlights/substrate as intake)
