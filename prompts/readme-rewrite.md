# README rewrite — implementation prompt

## Goal

Rewrite `README.md` cleanly in UTF-8: proper Vertex project structure (title, description, stack, project layout, routes, scripts, skills, workflow pointer). Then commit and push to `main`.

## Skills read

- `AGENTS.md` — workflow. No §4 skill applies to a README rewrite.

## Code inspected

- `README.md` — mixed encoding: UTF-8 head (create-next-app template), UTF-16LE tail (appended `# vertex-learning-platform` line). GitHub renders it as unstructured/garbled text. `git show HEAD:README.md` renders the head fine locally, confirming the tail bytes are the problem.
- `package.json` — Next 16.3.7, React 19.2.8, Tailwind v4, lucide-react.
- Confirmed scope from the repo: `/` (template), `/design-system` showcase, `components/ui` primitives, `prompts/`, `design/`, skills in `.agents/` + `.claude/`.

## Decisions and assumptions

1. **Full rewrite in UTF-8 without BOM**, replacing the template content — the template "Getting Started / Learn More / Deploy" boilerplate no longer describes this repo.
2. **Content**: project title + one-line pitch, stack table, repo layout, routes (`/`, `/design-system`), scripts, design-system section pointer, skills note, AGENTS.md workflow pointer.
3. **Nothing else changes.** No code, no tokens, no config.
4. Commit message: `docs: rewrite README in UTF-8 with project structure`. Push to `origin/main`.

## Files to touch

| File | Action |
|---|---|
| `README.md` | Rewrite, UTF-8 |

## Requirements

- File must be pure UTF-8, no null bytes (verify byte check after write).
- Renders as structured markdown on GitHub (headings, tables, lists).

## Security considerations

Docs only. No secrets, no env, no code.

## Acceptance criteria

1. `README.md` contains zero null bytes.
2. Commit + push succeed; GitHub renders structured markdown.

## Checks to run

```bash
# null-byte check + push
git add README.md && git commit -m "docs: rewrite README in UTF-8 with project structure" && git push
```

## Manual test steps

1. Open `https://github.com/DanielT13/vertex-learning-platform` and confirm the README renders with headings, stack table, and no garbled text.
