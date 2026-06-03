# WaterWatch Agent Notes

## Scope

These instructions apply to the `waterwatch` repository only.

## Development Expectations

- Keep the frontend and backend contracts aligned with the schemas in `shared/`.
- Run `npm run format:check`, `npm run lint`, `npm run type-check`, and `npm test` before merging non-trivial changes.
- Update specs under `specs/` when a change alters product behavior or delivery scope.

## Deployment

- GitHub Pages is the current public frontend deployment target.
- Backend deployment configuration lives in `render.yaml`.
