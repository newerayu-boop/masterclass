#!/usr/bin/env bash
# Publishes the current dist/ (from the checked-out branch) to GitHub Pages:
# https://newerayu-boop.github.io/masterclass/  (branch gh-pages).
# Run from the repository root:  bash tools/publish_pages.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'git -C "$ROOT" worktree remove --force "$TMP" >/dev/null 2>&1 || true' EXIT

git -C "$ROOT" fetch -q origin gh-pages
git -C "$ROOT" worktree add -q "$TMP" origin/gh-pages
find "$TMP" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r "$ROOT/dist/." "$TMP/"
touch "$TMP/.nojekyll"

cd "$TMP"
git add -A
if git diff --cached --quiet; then
  echo "Nothing changed, GitHub Pages is already up to date."
  exit 0
fi
git commit -q -m "Publish dist to GitHub Pages"
git push -q origin HEAD:gh-pages
echo "Published. Live in 1-2 minutes: https://newerayu-boop.github.io/masterclass/lead/"
