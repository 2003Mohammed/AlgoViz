# 🤝 Contributing to AlgoViz

First off, thank you for considering contributing to **AlgoViz**! 🎉  
Your time and effort make this project better for everyone.  

This document outlines the process to contribute effectively. Please follow these guidelines to keep contributions consistent, clear, and valuable.

---

## 🔀 How to Fork & Clone the Repository

1. Fork the repository:
   - Go to the [AlgoViz GitHub repository](https://github.com/2003Mohammed/AlgoViz).
   - Click **Fork** (top-right).

2. Clone your fork locally:
   
   git clone https://github.com/2003Mohammed/AlgoViz.git
   cd AlgoViz

3. Add the original repository as an upstream remote:

   git remote add upstream https://github.com/2003Mohammed/AlgoViz.git
  

---

## 🌿 Branch Naming Rules

Use clear and descriptive branch names based on the type of work:

* feature/<short-description> → for new features
* bugfix/<short-description> → for bug fixes
* docs/<short-description> → for documentation updates
* refactor/<short-description> → for refactoring existing code

**Examples:**

* feature/tree-visualizer
* bugfix/fix-array-generator
* docs/update-readme

---

## 📝 Commit Message Style

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
This helps maintain clean commit history and auto-generate changelogs.

**Format:**

<type>(scope): short description

**Types:**

* feat → New feature
* fix → Bug fix
* docs → Documentation
* style → Formatting, missing semi-colons, etc. (no code change)
* refactor → Refactoring code
* test → Adding or updating tests
* chore → Maintenance tasks, dependency updates

**Examples:**

* feat(tree): add binary search tree visualization
* fix(queue): resolve enqueue bug with empty state
* docs(contributing): update guidelines

---

## 💻 How to Run Project Locally

1. Install dependencies:

    npm install

3. Start the development server:
   
   npm run dev

5. Open the project in your browser:
   
   http://localhost:5173
   

> Note: This project uses **Vite + React + TypeScript**. Make sure you have **Node.js (>=16)** installed.

---

## 🚀 How to Submit a Pull Request (PR)

1. Create a new branch from main:

   git checkout -b feature/tree-visualizer
  
2. Make your changes, test thoroughly, and commit using proper style:

   git commit -m "feat(tree): add AVL tree visualization"

3. Push your branch to your fork:

   git push origin feature/tree-visualizer

4. Open a Pull Request:

   * Go to your fork on GitHub.
   * Click **Compare & Pull Request**.
   * Fill out the PR template with details.
   * Submit for review 🚀.

---

## ✅ Contribution Checklist

Before submitting a PR, make sure:

* [ ] Code follows project conventions (naming, formatting, linting).
* [ ] Code is well-documented where needed.
* [ ] All existing functionality works as expected.
* [ ] Tests are added/updated (if applicable).
* [ ] PR follows the provided [Pull Request Template](.github/pull_request_template.md).

---

## 🙌 Need Help?

If you’re stuck:

* Open an [Issue](../../issues).
* Start a [Discussion](../../discussions).
* Or reach out to maintainers.

We’re excited to see your contributions and grow AlgoViz together 💡.


