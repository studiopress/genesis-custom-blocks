# Contributing

## Requirements

- Node.js 20 (see `.nvmrc`)
- PHP 8.x
- Composer

## Setup

```sh
npm install
npx playwright install
```

## Running tests

### JavaScript unit tests

```sh
npm run test:js
```

### E2E tests

E2E tests use [Playwright](https://playwright.dev) against a local WordPress environment managed by `wp-env`.

**First-time setup** (and after `npm run wp-env destroy`):

Launch [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```sh
npm run wp-env start
npm run test:e2e:setup
```

`test:e2e:setup` creates an authenticated admin session and saves it to `tests/e2e/storage-states/admin.json`. This file is git-ignored and must be regenerated any time the environment is rebuilt.

**Run tests:**

```sh
npm run test:e2e          # headless
npm run test:e2e:ui       # Playwright UI mode (recommended for local development)
npm run test:e2e:debug    # headed with Playwright inspector
```

**Writing new tests with Playwright Codegen:**

Codegen records your browser interactions and generates Playwright test code. Run it with the admin session pre-loaded so you don't have to log in manually:

```sh
npx playwright codegen \
    --load-storage=tests/e2e/storage-states/admin.json \
    http://localhost:8888
```

**Stop the environment when done:**

```sh
npm run wp-env stop
```

### Linting

```sh
npm run lint
```

### PHP tests

```sh
composer test
```
