# Cross-Company Petition

Static site for a centralized petition where anyone can sign, regardless of company affiliation.

## How it works

- Signatures are stored as GitHub Issues labeled `signature` in this repository.
- The site fetches the list of issues via the public GitHub API and displays them.
- When you click "Sign the Petition", it opens a pre-filled new issue page on GitHub so you can submit your signature (you need a GitHub account).

## Setup

1. Create the `signature` label in the repository (Issues → Labels → New label, name it `signature`).
2. Enable GitHub Pages in repo settings (source: main branch, root).
3. The site will be available at `https://signal-drifts.github.io/petition/` (or your custom domain).

Edit `index.html` to change the petition statement.

## Notes

- Pure static: no backend needed.
- Updates appear within a minute (page polls the API).
- Public repo required for the API to be accessible without auth.
