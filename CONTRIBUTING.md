# Contributing to WaterWatch

Thank you for contributing to WaterWatch.

This document explains how to contribute code, documentation, tests, and design improvements to the project in a way that keeps the repository consistent and maintainable.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Workflow](#project-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Requests](#pull-requests)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

Be respectful, direct, and constructive.

When reviewing or discussing changes:

- focus on the code and behavior, not the person
- explain tradeoffs clearly
- prefer actionable suggestions over vague criticism
- assume good intent, but keep technical standards high

## Ways to Contribute

You can contribute in several ways:

- fixing bugs
- implementing features
- improving performance
- adding tests
- improving documentation
- refining accessibility and UI behavior
- reporting issues and edge cases

## Getting Started

Before making changes:

1. read the [README.md](C:\Users\gask4\waterwatch\README.md)
2. review the current project structure and scripts
3. check whether there is already related work in progress
4. keep changes focused to one problem or one feature at a time

## Development Setup

### Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL

### Install dependencies

```bash
npm install
```

### Configure environment

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### Generate Prisma client

```bash
npm run prisma:generate
```

### Run database migrations

```bash
npm run prisma:migrate
```

### Start the project

```bash
npm run dev
```

## Project Workflow

Use a simple branch-based workflow:

1. create a branch from `main`
2. make focused changes
3. run relevant tests and checks
4. open a pull request
5. address review comments
6. merge only after verification

Avoid mixing unrelated changes in one branch.

## Branch Naming

Use descriptive branch names:

- `feat/report-form-validation`
- `fix/auth-refresh-flow`
- `docs/update-user-manual`
- `refactor/admin-analytics-service`
- `test/add-complaint-route-tests`

Recommended prefixes:

- `feat/`
- `fix/`
- `docs/`
- `refactor/`
- `test/`
- `chore/`

## Commit Messages

Use clear, concise commit messages.

Preferred style:

```text
type: short summary
```

Examples:

- `feat: add complaint submission endpoint`
- `fix: validate upload mime types on server`
- `docs: expand readme project structure`
- `test: add health route smoke test`

Recommended commit types:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

## Coding Guidelines

### General

- keep files focused on a single responsibility
- prefer readable code over clever code
- avoid unrelated refactors in feature branches
- keep naming consistent with the rest of the project
- do not commit secrets or environment-specific credentials

### Frontend

- keep route pages thin where possible
- move reusable behavior into components, hooks, or utilities
- preserve accessibility and keyboard navigation
- keep responsive behavior in mind for citizen-facing flows

### Backend

- validate request payloads using shared Zod schemas when possible
- keep route handlers small and push reusable logic into services or utilities
- preserve the consistent API response shape
- do not bypass auth or role checks on protected routes

### Database

- make schema changes through Prisma
- keep migrations intentional and reviewable
- avoid breaking data model changes without updating dependent code

## Testing

Run the relevant checks before opening a pull request.

### Root-level checks

```bash
npm run test
```

### Backend tests

```bash
npm run test --workspace server
```

### Frontend tests

```bash
npm run test --workspace client
```

### Frontend production build

```bash
npm run build --workspace client
```

If your change affects setup, Prisma, auth, uploads, AI analysis, or route behavior, include a short note in the pull request describing what you verified manually.

## Documentation

Documentation is part of the product and should stay current with behavior.

Update documentation when you change:

- setup steps
- environment variables
- API behavior
- contributor workflow
- user-facing flows
- project structure

Relevant files may include:

- [README.md](C:\Users\gask4\waterwatch\README.md)
- [USER_MANUAL.md](C:\Users\gask4\waterwatch\USER_MANUAL.md)
- [CONTRIBUTING.md](C:\Users\gask4\waterwatch\CONTRIBUTING.md)

## Pull Requests

Each pull request should:

- have a clear title
- describe what changed
- explain why the change was needed
- mention any important tradeoffs
- include testing or verification notes

Good pull requests are:

- small enough to review clearly
- limited to one feature, fix, or refactor
- supported by tests when behavior changes

Before requesting review, confirm:

- the branch is up to date enough to merge cleanly
- tests relevant to the change have passed
- documentation is updated if needed
- no secrets or local-only files are included

## Issue Reporting

When reporting a bug, include:

- what you expected
- what actually happened
- steps to reproduce
- screenshots or logs if useful
- environment details when relevant

When proposing a feature, include:

- the problem it solves
- who benefits
- any constraints or tradeoffs

## Review Expectations

Code review should focus on:

- correctness
- security
- maintainability
- behavior regressions
- test coverage
- documentation gaps

If you approve a change, you are also approving its impact on the repository.

## Scope Discipline

Keep contributions narrow and deliberate.

Good:

- one bug fix
- one route improvement
- one UI enhancement
- one documentation update

Bad:

- a bug fix plus unrelated formatting cleanup
- a feature plus opportunistic schema redesign
- a documentation-only branch that silently changes runtime code

## Questions

If something is unclear:

- check the README first
- inspect the existing code structure
- open an issue or start a discussion before making a large change

Clear communication is better than avoidable rework.
