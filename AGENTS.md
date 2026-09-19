# cootie-oracle agent guide

cootie-oracle is a public, deterministic gematria cootie catcher. preserve the
schoolyard joke and the reconstructable arithmetic at the same time.

## required reading

1. `README.md` for the front door and current use;
2. `STATUS.md` for the current checkpoint;
3. `CONTRACTS.md` before changing ciphers, routing, tarot order, privacy, or
   projection boundaries;
4. the active file under `specs/` before implementing a material slice;
5. `docs/DEVELOPMENT.md` before running or closing work.

## authority

- `CONTRACTS.md` is normative.
- `STATUS.md` is current operational state.
- `specs/` owns proposed, accepted, or retired transitions.
- source and tests prove implemented behavior.
- `README.md` is the public front door, not a substitute for contracts.

## boundaries

- do not add a backend, database, analytics, ai generation, remote font, or
  third-party runtime request without a separately accepted spec.
- never add randomness to canonical consultation.
- preserve cipher identity even where results coincide.
- keep the browser, receipt, and printable artifact on the same domain and
  edition sources.
- never read or introduce repository-root `.env` files; the project requires
  no secrets.
- github workflow files may be prepared locally, but pushing, enabling pages,
  or changing repository settings requires explicit authorization.
- a visual screenshot does not prove the physical fold. report the physical
  print/fold boundary honestly.

## validation

```bash
npm test
npm run test:e2e
npm run build
python3 /home/resonatingloop/.codex/skills/manage-project-docs/scripts/check_docset.py .
git diff --check
```

for user-visible changes, also perform the rendered checks in
`docs/DEVELOPMENT.md`.
