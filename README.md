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
[[d1_databases]]
binding = "DB"
database_name = "<database-name>"
database_id = "<database-id>"
```

### Sync table structure

Sync the sql files of `drizzle`, execute the following command using `d1 execute` command

```bash
wrangler d1 execute eleven --file .\drizzle\0000_reflective_dracula.sql
```

### Configure R2 bucket

Set the `r2_bucket` field in `wrangler.toml` to your bucket information (**required**)

Example:

```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "<bucket-name>"
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
