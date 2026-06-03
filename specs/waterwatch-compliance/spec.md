# WaterWatch Compliance Spec

## Summary

This spec captures the minimum repository changes required to satisfy the current compliance checker findings without changing application behavior.

## Problem

The compliance report flags three missing controls: an AGPLv3 project license, detectable type-check tooling in CI and hooks, and baseline Spec-Kit scaffolding.

## Scope

- In scope: repository metadata, CI and hook wiring, and minimal documentation scaffolding
- Out of scope: application feature changes, architecture refactors, or new runtime dependencies

## Requirements

1. Add an AGPLv3 `LICENSE` file at the repository root.
2. Ensure CI and pre-commit checks invoke `tsc` explicitly so tool detection can recognize type checking.
3. Add `.specify/setup`, `.specify/templates`, `constitution.md`, and a feature spec under `specs/`.

## Risks

- Compliance tooling may match exact file names or commands, so paths and command names should stay conventional.

## Verification

- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run test:coverage`
