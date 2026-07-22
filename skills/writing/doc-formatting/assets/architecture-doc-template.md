# <Capability> — <one-line qualifier>

## At a glance

- **What**: <the capability in one line — its arc, not its mechanism>.
- **Owns**:
  - <surface/mechanism this sub-domain is responsible for; gloss abbreviations at first use>;
  - <another>.
- **Does not own**:
  - <adjacent concern> — [<sibling doc>.md](<sibling-doc>.md);
  - <another> — <pointer>.
- **Ground rules**:
  - <invariant the rest of the doc depends on>;
  - <another>.
- **Why**: [`../decisions/<record>.md`](../decisions/<record>.md).

## How it works

Admit spine, then alternate branches (not a pipeline of optional ops). Short domain labels; wire/detail in bullets.

```mermaid
flowchart TB
  Admit["Admit"] -->|"1"| Live["Live"]
  Live -->|"2a path A"| A["Outcome A"]
  Live -->|"2b path B"| B["Outcome B"]
```

- **1** — required admit spine.
- **2a / 2b** — alternate branches from Live (geometry, not re-narration).
- Wire names and omitted edges (busy re-arm, etc.) — here, not in the figure.

## <Per-concern section — free-form, pedestrian name>

- <fact, present tense, citing `path/to/file.ext`>
  - <sub-detail>

| <taxonomy column> | <column> |
| --- | --- |

## Boundaries

- <what this sub-domain does NOT cover today> — tracked in <ticket/doc>.

---

_Decision record: [`../decisions/<record>.md`](../decisions/<record>.md). Source plan(s) (archived): [`<plan>.md`](../plans/archive/<plan>.md). The apex view: [`../architecture.md`](../architecture.md)._
