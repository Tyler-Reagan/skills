---
name: aqua-diagram
description: >-
  Iterate on an existing Mermaid, SVG, or architecture diagram using the
  Planisphere MCP (planisphere.dev/mcp). Aquarius lifts the diagram into a
  semantic IR, lets you refine meaning cheaply, then lowers back to the
  user's original format. Use when the user has a diagram they want to
  improve, extend, or render via Planisphere.
user-invocable: true
allowed-tools:
  - mcp__planisphere__get_guide
  - mcp__planisphere__list_kinds
  - mcp__planisphere__validate_diagram
  - mcp__planisphere__render_diagram
  - mcp__planisphere__lift_mermaid
  - mcp__planisphere__lower_mermaid
---

# Aqua-Diagram Skill

Aquarius is the semantic iteration layer, not the visualization layer.
Lift → edit meaning in .aqua → deliver in the user's original format.

## Flows

**Mermaid round-trip** (most common):
```
lift_mermaid → [edit .aqua] → lower_mermaid(type=<original>)
```
Return Mermaid. The layout solver is irrelevant — Mermaid's renderer handles layout.

**New diagram or SVG requested**:
```
get_guide → list_kinds → author .aqua → validate_diagram → render_diagram
```
Share the `planisphere.dev/view` URL — an HTML viewer with the SVG embedded.

## Rules
- Call `get_guide` before authoring `.aqua` from scratch
- `lower_mermaid` is the deliverable for Mermaid round-trips, not `render_diagram`
- Never author `@layout` coordinates — use `@hints { rank / lane }` for layout intent
