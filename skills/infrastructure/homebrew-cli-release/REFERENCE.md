# Homebrew CLI Release — Reference

Templates for the workflow in [SKILL.md](SKILL.md). Replace every `<user>` (GitHub owner) and `<tool>` (binary/command name) placeholder. The build-side sections (§Version, §GoReleaser) use **Go** as the worked example; the tap/token/verify sections are language-agnostic.

> Time-sensitive notes are dated. Re-verify version-pinned claims against current upstream docs before relying on them.

## §Version — inject a build-time version (Go example)

```go
// Overridable at build time; defaults cover `go run`/`go build` from source.
var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

func main() {
	for _, arg := range os.Args[1:] {
		switch arg {
		case "-v", "--version", "version":
			fmt.Printf("<tool> %s (commit %s, built %s)\n", version, commit, date)
			return
		case "-h", "--help", "help":
			fmt.Println("<tool> — <one-line description>.")
			return
		}
	}
	// ... launch the app ...
}
```

Verify injection before touching CI:

```bash
go build -ldflags "-X main.version=1.2.3 -X main.commit=abc -X main.date=2026-01-01" -o /tmp/<tool> .
/tmp/<tool> --version   # -> <tool> 1.2.3 (commit abc, built 2026-01-01)
```

**Go gotcha:** the module path in `go.mod` is case-sensitive and independent of the GitHub repo's display case. `go install <module-path>@latest` must use the exact module path, not the repo URL casing.

## §GoReleaser — `.goreleaser.yaml` (cask path)

```yaml
version: 2
project_name: <tool>
before:
  hooks:
    - go mod tidy          # Go-specific; drop/replace for other toolchains
builds:
  - id: <tool>
    main: .
    binary: <tool>
    env: [CGO_ENABLED=0]
    goos: [darwin, linux]
    goarch: [amd64, arm64]
    ldflags:
      - -s -w
      - -X main.version={{ .Version }}
      - -X main.commit={{ .Commit }}
      - -X main.date={{ .Date }}
archives:
  - formats: [tar.gz]
    name_template: "{{ .ProjectName }}_{{ .Version }}_{{ .Os }}_{{ .Arch }}"
checksum:
  name_template: "checksums.txt"
homebrew_casks:
  - name: <tool>
    binaries: [<tool>]
    repository:
      owner: <user>
      name: homebrew-tap
      branch: main
      token: "{{ .Env.HOMEBREW_TAP_GITHUB_TOKEN }}"   # cross-repo PAT, NOT GITHUB_TOKEN
    directory: Casks
    homepage: "https://github.com/<user>/<tool>"
    description: "<one-line description>"
    commit_author:
      name: goreleaser-bot
      email: goreleaser@users.noreply.github.com
    # Unsigned binary -> macOS quarantines it. Strip so it launches without
    # the "developer cannot be verified" prompt.
    hooks:
      post:
        install: |
          if OS.mac?
            system_command "/usr/bin/xattr", args: ["-dr", "com.apple.quarantine", "#{staged_path}/<tool>"]
          end
```

Validate, then dry-run and inspect the generated `.rb`:

```bash
goreleaser check
goreleaser release --snapshot --clean --skip=publish
cat dist/homebrew/Casks/<tool>.rb
```

**Non-Go builds:** replace `builds:` with the [`prebuilt` builder](https://goreleaser.com/customization/builds/prebuilt/) pointing at binaries your own toolchain produced, or use a sibling tool. The `homebrew_casks` block is unchanged.

**Formula instead of cask** (needed for Linux `brew`): a formula has no quarantine `postflight`; it uses `install`/`test` blocks and lives in `Formula/`. Casks are macOS-only but auto-handle quarantine. Note `brews:` was the formula key and is deprecated as of GoReleaser v2 (early 2026).

## §Workflow — `.github/workflows/release.yml`

```yaml
name: release
on:
  push:
    tags: ["v*"]
permissions:
  contents: write          # create the Release + upload assets in THIS repo
jobs:
  goreleaser:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }     # full history for the changelog
      - uses: actions/setup-go@v5    # Go-specific; swap for your toolchain
        with: { go-version: stable }
      - uses: goreleaser/goreleaser-action@v6
        with:
          version: "~> v2"
          args: release --clean
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}                       # Release in this repo
          HOMEBREW_TAP_GITHUB_TOKEN: ${{ secrets.HOMEBREW_TAP_GITHUB_TOKEN }}  # push to the tap repo
```

> As of mid-2026, GitHub is migrating actions off Node 20; pinned action majors (`@v4`/`@v5`/`@v6`) normally get patched upstream. If a run warns or fails on the Node runtime, bump the action versions.

## §Token — the cross-repo PAT

The default `GITHUB_TOKEN` can write only to the repo running the workflow, so it **cannot** push the cask into the separate tap repo. Create a scoped PAT:

1. **Fine-grained PAT** → Resource owner `<user>` → Repository access: *Only select repositories* → the **tap** repo → Permissions: **Contents: Read and write** (auto-adds Metadata: Read-only).
   - Classic-token fallback: `repo` scope (broader — covers all your repos, so prefer an expiration there).
2. Store it on the **code** repo (run yourself so the token stays out of logs):
   ```bash
   gh secret set HOMEBREW_TAP_GITHUB_TOKEN --repo <user>/<tool>
   ```
3. Verify: `gh secret list --repo <user>/<tool>`.

A single-repo, Contents-only PAT is a defensible no-expiry token; broad/classic tokens should expire. A leaked tap-write token is a supply-chain foothold (it can rewrite the installer), so scope tightly.

## §Verify — first release end to end

```bash
git tag v0.1.0 && git push origin v0.1.0
RUN=$(gh run list --repo <user>/<tool> --workflow release.yml --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN" --repo <user>/<tool> --exit-status

# Confirm both outputs landed:
gh release view v0.1.0 --repo <user>/<tool> --json assets --jq '.assets[].name'
gh api repos/<user>/homebrew-tap/contents/Casks/<tool>.rb --jq '.path'

# The real test — a green workflow is not proof of a working install:
brew install <user>/tap/<tool> && <tool> --version
xattr "$(which <tool>)"   # com.apple.quarantine should be ABSENT (com.apple.provenance is harmless)
```
