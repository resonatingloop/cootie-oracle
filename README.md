# cootie-oracle

a deterministic gematria cootie catcher. offer a phrase, choose a cipher, and
let the numerical tenant leave an irresponsible note about your future.

target site: <https://resonatingloop.github.io/cootie-oracle/>

## what waits beneath the flap

```text
the phrase is the offering.
the cipher is the lens.
the value is the address.
the tarot card is the resident.
the fortune is the note taped to its door.
```

field oracle no. 01 calculates `AQ`, `Ordinal`, `QWER`, or `nQWER`, routes the
positive value through paper-plex v1, and reveals one of twenty-two major
arcana plus one of eight authored schoolyard fortunes. no random draw occurs.

the same edition, cipher, and value always reaches the same result. equal
values are fold-twins.

## run it

requires node.js 24 or another vite-supported release.

```bash
npm ci
npm run dev
```

open <http://127.0.0.1:5173/cootie-oracle/>. enter a phrase, choose one of the
four flaps, and select `fold my fate`.

## prove it

```bash
npm test
npm run test:e2e
npm run build
```

the test suite checks the four cipher mappings, deterministic route, all eight
zones, all twenty-two arcana, error boundaries, and the founding numeric route.
the browser suite exercises desktop, phone, reduced-motion, refusal, print, and
download behavior in chrome:

```text
888 → zone 8 → the fool → fifth return → reversed
```

## print it

complete a consultation and choose `print the oracle`, or download the
standalone svg. use ordinary copy paper: cut out the square, place the printed
side down, fold every corner to the center, turn it over, and fold every corner
to the center again. sharpen the creases before operating it.

the generated template is implemented, but a fresh physical print/fold check
remains the final material proof whenever its geometry changes.

## privacy

the app is static and client-only. offerings are not uploaded, saved, placed
in urls, or sent to analytics. the site has no backend, database, remote font,
or runtime third-party request.

## project map

| path | authority |
|---|---|
| `README.md` | public front door and shortest successful use |
| `AGENTS.md` | collaborator reading order, boundaries, and validation |
| `STATUS.md` | current verified checkpoint |
| `CONTRACTS.md` | normative cipher, routing, tarot, and privacy law |
| `docs/DEVELOPMENT.md` | exact setup, proof, recovery, and deployment procedure |
| `specs/` | proposed, accepted, and retired implementation transitions |
| `src/domain/` | deterministic calculation authority |
| `src/content/` | authored oracle editions |
| `tests/` | executable invariant proofs |

## license

mit. fold irresponsibly.
