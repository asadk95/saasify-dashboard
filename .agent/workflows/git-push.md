---
description: How to push code changes to GitHub
---

# Git Workflow - Push Changes to GitHub

## Every Time You Make Changes

Run these 3 commands in your terminal:

```bash
# 1. Stage all changes
git add .

# 2. Commit with a message
git commit -m "Your message here"

# 3. Push to GitHub (Vercel auto-deploys!)
git push
```

// turbo-all

---

## Common Scenarios

### Fixed a bug
```bash
git add .
git commit -m "Fixed: login validation error"
git push
```

### Added a feature
```bash
git add .
git commit -m "Added: dark mode toggle"
git push
```

### Updated styling
```bash
git add .
git commit -m "Updated: dashboard card styles"
git push
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `git status` | See changed files |
| `git diff` | See what changed in files |
| `git log -5` | See last 5 commits |
| `git pull` | Get latest from GitHub |

---

## If Something Goes Wrong

### Undo last commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Discard all local changes
```bash
git checkout .
```

### Forgot to add files to last commit
```bash
git add .
git commit --amend --no-edit
git push --force
```
