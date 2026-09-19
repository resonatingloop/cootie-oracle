# development

status: operational/current

## requirements

- node.js 24 or another vite-supported release
- npm

no environment variables, api keys, database, or external service are needed.

## cold start

```bash
npm ci
npm run dev
```

open `http://127.0.0.1:5173/cootie-oracle/`. a successful start shows the
cootie-oracle masthead, one offering field, and four cipher flaps.

## proof commands

```bash
npm test
npm run test:e2e
npm run build
npm run preview
```

`npm test` proves the cipher mappings and paper-plex route. `npm run build`
type-checks the application and emits the deployable static site to `dist/`.
`npm run test:e2e` drives the installed stable chrome channel through desktop,
mobile, reduced-motion, refusal, print, and download paths. `npm run preview`
serves the production build for local inspection.

## rendered checks

before closing a visual change, inspect at minimum:

- a desktop viewport around 1440 by 1000;
- a phone viewport around 390 by 844;
- the initial, folding, and revealed states;
- keyboard focus and form submission;
- reduced-motion behavior;
- print preview on us letter and a4;
- a downloaded svg opened independently from the web application.

changes to print geometry are not fully proven until somebody prints, cuts,
folds, and operates the sheet.

## managed-environment cache recovery

some managed workspaces expose the default npm cache as read-only. if install
fails with `erofs` under the user npm cache, keep repository paths unchanged
and use a task-specific temporary cache:

```bash
npm ci --cache /tmp/cootie-oracle-npm-cache
```

vite is intentionally configured with `envDir: "public-env"`. this application
does not consume repository-root `.env` files or secret-bearing configuration.

## github pages

the production base is `/cootie-oracle/`. `.github/workflows/pages.yml` tests,
builds, uploads `dist/`, and deploys it after pushes to `main`. pull requests
run the build job but do not deploy.

the repository owner must select `github actions` as the pages source in the
repository settings before the first deployment can succeed.
