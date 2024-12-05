# A Comprehensive Cloudflare Workers Tutorial

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/powerfulyang/cloudflare-worker-tutorial)

## Introduction

This tutorial will guide you step by step from scratch on how to develop your own API service using Cloudflare Workers.

Preview: https://life.littleeleven.com

## Install Dependencies

Recommended to use [pnpm](https://pnpm.io/installation) to install dependencies

```bash
pnpm install
```

## Configure wrangler

### Configure D1 database

> Related documentation: https://developers.cloudflare.com/workers/wrangler/commands/#d1

Set the `d1_database` field in `wrangler.toml` to your database information (**required**)

Example:

```toml
d1_databases = [ { binding = "DB", database_name = "littleeleven", database_id = "c6ca0e33-ea58-48d3-b779-a21f9a063812" }, ]
```

### Sync table structure

Sync the sql files of `drizzle`, execute the following command (**required**)

```bash
wrangler d1 migrations apply littleeleven --local
```

### Manage the secret variables for oauth providers

> Related documentation: https://developers.cloudflare.com/workers/wrangler/commands/#secret

```bash
wrangler secret put JWT_SECRET

wrangler secret put GOOGLE_ID
wrangler secret put GOOGLE_SECRET

wrangler secret put GITHUB_ID
wrangler secret put GITHUB_SECRET

wrangler secret put DISCORD_ID
wrangler secret put DISCORD_SECRET
```

## Start local development server

Execute the following command to start the local development server

```bash
# run your Worker in an ideal development workflow (with a local server, file watcher & more)
pnpm run start:local
```

## Test

### Unit test

```bash
pnpm run unit:test
```

### Integration test

```bash
pnpm run e2e:test
```

## Deploy

```bash
# deploy your Worker globally to the Cloudflare network (update your wrangler.toml file for configuration)
pnpm run deploy
```
