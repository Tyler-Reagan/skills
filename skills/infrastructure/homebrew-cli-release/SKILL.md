---
name: homebrew-cli-release
description: Directs the end-to-end process of shipping a self-contained compiled CLI as a `brew install`-able command. The build half is GoReleaser for Go (and GoReleaser's prebuilt builder or a sibling tool like cargo-dist for Rust/Zig/etc.); the Homebrew half — tap, release token, cask, quarantine, license — is language-agnostic. Use when the user says "distribute this on homebrew", "make my CLI installable", "brew install my tool", "set up a homebrew tap", "release my Go CLI", "use goreleaser", "invoke it via command instead of go run / cargo run", or wants prebuilt binaries on a GitHub Release with an auto-updated Homebrew formula/cask. Covers version-injection wiring, the homebrew_casks-vs-deprecated-brews choice, personal-tap-vs-homebrew-core, the cross-repo release token, macOS Gatekeeper quarantine handling, the license gate, and cutting plus verifying the first tagged release.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: developer-workflow
  triggers: distribute on homebrew, brew install my CLI, homebrew tap, goreleaser, release my Go CLI, make my tool installable, invoke via command not go run, publish prebuilt binaries
  role: scaffolding
  scope: implementation
  output-format: markdown
  related-skills: gitlab-ci-inspector
---

# Ship a compiled CLI to Homebrew (GoReleaser)

Turn a "you have to `go run .` / `cargo run`" project into a `brew install <user>/tap/<tool>` command. A release tool cross-compiles binaries, publishes a GitHub Release, and commits a Homebrew formula/cask into your tap on every tagged push.

**Outcome:** `brew install <user>/tap/<tool>` → `<tool>` on `$PATH` → `<tool> --version`.

**Language scope:** the worked example and templates use **Go + GoReleaser**. GoReleaser's native builder is Go-only — for other compiled languages either feed externally-built binaries to GoReleaser's `prebuilt` builder, or use a sibling release tool (e.g. `cargo-dist` for Rust). Everything from the tap repo onward (token, cask, quarantine, license, tag-push release) is identical regardless of language; only phases 2 and 4's build mechanics are Go-specific.

File templates (`.goreleaser.yaml`, release workflow, version snippet, PAT setup, cask vs formula): see [REFERENCE.md](REFERENCE.md). This file is the decision flow and the gotchas.

## Decide first (don't hardcode the path)

| Fork                              | Default                                                                                                             | Choose the other when                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **cask vs formula**               | `homebrew_casks` (prebuilt binary; `brews` is deprecated as of GoReleaser v2, early 2026 — re-check current status) | You need Linux `brew` support — casks are macOS-only; a formula works on both       |
| **personal tap vs homebrew-core** | personal `homebrew-<name>` tap                                                                                      | The tool is popular/stable enough for core (high notability bar, maintainer review) |
| **quarantine-strip vs notarize**  | strip `com.apple.quarantine` in a cask `postflight`                                                                 | You have an Apple Developer cert and want real code-signing/notarization            |
| **CI vs local release**           | GitHub Actions on tag push                                                                                          | One-off / private; run `goreleaser release` locally with a token in env             |

## Workflow

1. **Confirm preconditions** — `go`/`cargo`/etc. builds clean; `gh auth status` is logged in; tests pass. Pick the forks above.
2. **Inject version into the binary** _(build-tool-specific)_ — add a build-time-overridable version var + `--version`/`--help` flags. Go: linker `-ldflags -X`. Rust: `env!("CARGO_PKG_VERSION")` or a build script. Verify a manual build prints the injected value before wiring CI. (REFERENCE.md §Version)
3. **Create the tap repo** — `gh repo create <user>/homebrew-tap --public --add-readme`. The `homebrew-` prefix is mandatory; brew auto-prepends it. One tap holds many tools.
4. **Add `.goreleaser.yaml`** — builds + archives + checksum + the `homebrew_casks` block pointing at the tap. Validate with `goreleaser check`, then dry-run with `goreleaser release --snapshot --clean --skip=publish` and inspect the generated `.rb`. (REFERENCE.md §GoReleaser)
5. **Add the release workflow + token** — `.github/workflows/release.yml` runs GoReleaser on `v*` tags. Create a **cross-repo PAT** (Contents: read+write on the _tap_ repo only) and store it as the `HOMEBREW_TAP_GITHUB_TOKEN` repo secret. (REFERENCE.md §Workflow, §Token)
6. **License gate** — public distribution needs a LICENSE; no file means all-rights-reserved. Confirm one with the user and add it before releasing.
7. **Cut + verify the first release** — `git tag v0.1.0 && git push origin v0.1.0` → `gh run watch <id> --exit-status` → confirm the Release assets and the `Casks/<tool>.rb` in the tap → end-to-end `brew install <user>/tap/<tool> && <tool> --version`.

### Per-phase checklist

- [ ] Manual build with injected version prints it via `--version` (phase 2)
- [ ] Tap repo named `homebrew-*` and public (phase 3)
- [ ] `goreleaser check` passes **and** snapshot `.rb` inspected (phase 4)
- [ ] `HOMEBREW_TAP_GITHUB_TOKEN` secret set on the **code** repo, scoped to the **tap** repo (phase 5)
- [ ] LICENSE present and confirmed (phase 6)
- [ ] First release verified by real `brew install`, not just a green workflow (phase 7)

## Gotchas (the reason this skill exists)

- **`brews` is deprecated** as of GoReleaser v2 (early 2026; verify against current docs) — `goreleaser check` flags it. Use `homebrew_casks`. The field is `binaries:` (a list), tap target is `repository:` (not the old `tap:`).
- **The default `GITHUB_TOKEN` cannot push to the tap.** It only has write on the _current_ repo. The cask push to a _different_ repo (`homebrew-tap`) needs a PAT. Symptom if missing/mis-scoped: release builds fine, then 403/404 at the cask step.
- **Unsigned binaries get Gatekeeper-quarantined.** Without a cask `postflight` that strips `com.apple.quarantine`, users hit "cannot be opened because the developer cannot be verified." (`com.apple.provenance` remaining afterward is harmless.)
- **Casks are macOS-only.** Generate Linux tarballs anyway for direct download or a language-native install (`go install`, `cargo install`, …), but tell Linux users `brew` won't install the cask.
- **Tap repo name is load-bearing.** `brew install u/tap/x` clones `github.com/u/homebrew-tap`. A repo not named `homebrew-*` is untappable — you can't reuse the code repo.
- **A green workflow ≠ a working install.** Always finish with a real `brew install` + `--version`.

## Anti-Patterns

**DO NOT** use `brews:` in new configs — it's deprecated; reach for `homebrew_casks`.

**DO NOT** rely on `secrets.GITHUB_TOKEN` for the tap push — it lacks cross-repo write.

**DO NOT** ship a public cask without a LICENSE — that's all-rights-reserved code on a public installer.

**DO NOT** declare the task done on a green CI run — verify with an actual `brew install`.

**DO NOT** hardcode "Go + cask + personal tap" — surface the forks above; the next project may want a formula or homebrew-core.
