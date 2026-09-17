# Electric Book CLI (`eb`)

A small command-line front end for this **EBTv1** project that mimics the
**EBTv2** `npm run eb -- ...` commands. Instead of the interactive
`run-linux.sh` / `run-mac.command` / `run-windows.bat` menus, it runs the same
underlying build commands directly, driven by flags. This lets team members
who know the EBTv2 commands work in this v1 repo without learning the
interactive scripts.

It is intentionally dependency-free (pure Node, using the built-in
`node:util` arg parser), so it can be copied into other EBTv1 projects.

## Requirements

The same tools the shell scripts need, on your PATH: `bundle` (Jekyll),
`gulp`, `prince` (PDF), `pandoc` (Word), `java` (optional EPUB validation),
`rsync` (app staging), and `cordova` (optional native app builds).

## Usage

Always run from the project root:

```
npm run eb -- <command> [options]
```

Run `npm run eb` with no arguments for help.

### Commands

| Task | Command |
|---|---|
| Serve website locally | `npm run eb -- output` |
| Build print PDF | `npm run eb -- output -f print-pdf` |
| Build screen PDF | `npm run eb -- output -f screen-pdf` |
| Build EPUB | `npm run eb -- output -f epub` |
| Build app files | `npm run eb -- output -f app` |
| Export to Word | `npm run eb -- output -f word --from web` |
| Specific book + language | `npm run eb -- output -f print-pdf -b book -l fr` |
| Process images | `npm run eb -- images` |
| Rebuild search index | `npm run eb -- reindex` |
| Install/update dependencies | `npm run eb -- setup` (or `npm run setup`) |

### Options

| Flag | Meaning |
|---|---|
| `-f, --format <name>` | Output format for `output` (default `web`) |
| `-b, --book <folder>` | Book folder to process (default `book`) |
| `-l, --language <code>` | Translation subdirectory (e.g. `fr`) |
| `-c, --config <files>` | Extra Jekyll configs, comma-separated, no spaces |
| `--mathjax` | Enable MathJax processing (pdf, epub, app) |
| `--baseurl <path>` | Base URL for the website (web only) |
| `--from <format>` | Source format for Word export (default `screen-pdf`) |
| `--platform <a\|i\|ai>` | Native app platform(s) to build (app only) |
| `--release` | Build a release app (app only) |
| `--epubcheck <dir>` | Validate the epub with a local EpubCheck in `<dir>` (epub only) |
| `--skip-validation` | Skip epub validation, which otherwise runs by default (epub only) |

## How it differs from the interactive scripts

- **Non-interactive.** Every `read` prompt in the shell scripts becomes a
  flag. Nothing waits for keyboard input.
- **No "run again" loops.** Each command runs once and exits, so it is safe
  in scripts and CI.
- **No file-browser opening.** The scripts call `xdg-open`/`open`, which is
  pointless on a headless machine; this CLI just prints the output path.
- **App builds** skip the emulator launch; they build and report the output
  folder. iOS builds only run on macOS.
- **EPUB validation** runs by default (like EBTv2), using the `epubchecker`
  package via `npx` so nothing is added to the project. Use `--epubcheck
  <dir>` to validate with a local EpubCheck install instead, or
  `--skip-validation` to skip it.

## Notes on parity

The CLI reproduces the exact commands and config overlays from the shell
scripts (see each file in `lib/`). Where the shell scripts have a
pre-existing problem — for example a missing SCSS partial that breaks the
EPUB build — this CLI will surface the same failure, because it runs the
same `bundle exec jekyll build`. Fixing such content issues is out of scope
for this wrapper.

## Layout

```
_tools-custom/eb/
  cli.js          Entry point: arg parsing, dispatch, help
  lib/run.js      Process spawning, Jekyll builds, fs helpers
  lib/pdf.js      Print and screen PDF (options 1 & 2)
  lib/web.js      Website serve (option 3)
  lib/epub.js     EPUB assembly and packaging (option 4)
  lib/app.js      App files and optional Cordova builds (option 5)
  lib/word.js     Word export via Pandoc (option 6)
  lib/images.js   Image conversion (option 7)
  lib/reindex.js  Search index refresh (option 8)
  lib/setup.js    Dependency install/update (option 9)
```
