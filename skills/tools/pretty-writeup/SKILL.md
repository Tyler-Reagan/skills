---
name: pretty-writeup
description: Distills a topic, document, notes, or conversation into a self-contained styled HTML brief using the house template kit. Use when the user says "make an HTML writeup", "format this as an HTML report", "turn this doc into a styled page", "pretty HTML version", "stylize this markdown", "HTML report from this doc", "presentation brief", "one-pager for leadership", or asks for a shareable HTML artifact from a communicated topic.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.2.0"
  domain: developer-workflow
  triggers: make an html writeup, format as html report, turn markdown into a styled page, pretty html version, stylize this markdown, html report from this doc, styled html artifact, presentation writeup, presentation brief, one-pager for leadership
  role: formatting
  scope: documentation
  output-format: code
  related-skills: doc-formatting, pretty-mermaid, mermaid-diagrams
---

# Pretty Writeup

Produce a single self-contained HTML artifact that communicates the essential story from a topic, source doc, notes, or prior conversation. This is a **communication skill**, not a converter: first establish the brief, then package distilled ideas with the house template kit where those templates help.

Sister to `doc-formatting` (markdown-as-markdown) and `pretty-mermaid` (diagram rendering). Use this when the deliverable is a styled, shareable page.

## Operating model

Intake -> Substrate -> Author.

| Phase | Purpose | Output |
| --- | --- | --- |
| **Intake** | Gather raw material: file, topic, notes, multiple docs, conversation | Working context |
| **Substrate** | Agree what the page is for | Audience, job, thesis, critical path, scope, register |
| **Author** | Distill, structure, choose templates, emit HTML | One `.html` artifact |

Do not emit HTML until substrate is sufficient or the user explicitly waives questions ("skip questions", "use your judgment", "draft it").

## Substrate gate

Before authoring, hold a short brief:

- **Audience**: technical, mixed, leadership, or other.
- **Job**: decide, align, inform, record.
- **Thesis**: one sentence the reader should leave believing or knowing.
- **Critical path**: 3-7 ideas that must land.
- **In / out**: what belongs in the body vs footer or omission.
- **Register**: brief default or evidence default; borrow components freely.
- **Visuals**: diagram / metrics required, optional, or omitted.

Guided vs enforced:

| Intake | Mode | Behavior |
| --- | --- | --- |
| Rich presentation-ready source | Guided | Draft substrate and ask for one confirmation |
| Topic-only or thin prompt | Enforced | Ask until audience, thesis, and critical path are clear |
| Multiple conflicting inputs | Enforced | Resolve thesis and in/out before layout |
| User asks to skip questions | Waived | Proceed and note assumptions only if non-obvious |

Use `AskQuestion` when available; keep it to the smallest form that resolves ambiguity. See [REFERENCE.md](REFERENCE.md) for suggested prompts and waiver language.

## Workflow

1. **Intake** the available material and identify whether substrate is guided, enforced, or waived.
2. **Confirm substrate** or document the waiver.
3. **Resolve theme**: dark default; light only if requested.
4. **Distill critical path** from substrate, not from the source outline.
5. **Pick register default**: brief for presentation / mixed-audience / strategy; evidence for metrics / flags / reproducibility. Borrow components across registers when one element earns it.
6. **Author from the kit**: start with `assets/shell.html`, use [REFERENCE.md](REFERENCE.md) for idea-type packaging and fit checks, simplify before extending with token-backed CSS.
7. **Redraw diagrams** as hand-built SVG when a flow/comparison earns a visual. Mermaid or prose diagrams are input material, not output.
8. **Emit** one `.html`: next to the source when there is one, otherwise at the agreed path.
9. **Self-check** before final response.

## Content discipline

- Critical information only. If a detail does not support the thesis or critical path, cut it or move provenance to the footer.
- Headline + detail, not paragraphs. `.fact-punch` / `.point-head` carry the idea; `.bridge` is one phrase.
- Diagrams over prose for flows and comparisons; `.facts` over bullets for parallel constraints.
- Staccato captions: three beats max, one line where possible.
- Audience-appropriate language. Translate jargon into outcome language when accuracy survives.
- No emoji. Text markers and color only.

## Gotchas

- **Topic-only intake needs substrate.** A prompt like "make a leadership brief on X" is not enough to author HTML unless the user waives questions.
- **Source structure is not the critical path.** Headings, bullets, and admonitions are weak hints; substrate decides the story.
- **Empty or redundant components are worse than plain HTML.** Skip one-item `.facts`, two-card `.points`, and `.bridge` text that repeats adjacent cards.
- **Register is a default, not a purity test.** A brief page may need one table; an evidence page may close with one `.bridge`.
- **Do not fill the reference catalog.** Use only components the content earns; plain `h2`, `p`, `ul`, and `table` remain valid.
- **No gradient masthead.** `.masthead` is spacing + optional kicker only.
- **Mermaid is source material.** Hand-author SVG or omit the visual; do not leave raw mermaid in output.
- **Self-contained or broken.** Dark theme makes zero network requests. Light theme's Google Fonts link is the only external request.
- **Re-token per theme.** Component colors come from `:root`; SVG hex should match active tokens.
- **Do not copy proprietary HTML into this skill.** Re-author content into the kit.

## Self-check

- [ ] Would this page work if the reader never saw the source material?
- [ ] Does every section trace to the substrate critical path?
- [ ] Can the target audience grasp one takeaway per section?
- [ ] Topic-only intake has confirmed substrate or documented waiver.
- [ ] Every `.bridge` is one phrase; figcaptions are staccato when present.
- [ ] Footer carries provenance; body carries the argument.
- [ ] No emoji, no raw mermaid, self-contained HTML.
- [ ] Light theme: `:root` swapped, font link present, callouts re-tokened.
