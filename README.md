# 一个较为完备的 Cloudflare Workers 教程

## 介绍

本教程将带你从零开始，一步步学习如何使用 Cloudflare Workers 开发专属于你的 API 服务。

Preview: https://life.littleeleven.com

## 安装依赖

推荐使用 `[pnpm](https://pnpm.io/installation)` 安装依赖

```bash
pnpm install
```

## 配置 wrangler

设置 `wrangler.toml` 中 d1_database 字段为你的数据库相关信息 (**必须**)
具体内容类似下面：

```toml
[[d1_databases]]
binding = "DB"
database_name = "<database-name>"
database_id = "<database-id>"
```

## 配置开发环境之 D1 database

> 相关文档: https://developers.cloudflare.com/workers/wrangler/commands/#d1

### 同步表结构

同步 `drizzle` 的 sql 文件，即使用 d1 execute 命令执行

```bash
wrangler d1 execute eleven --file .\drizzle\0000_high_marauders.sql
```

## 启动

执行以下命令启动本地开发服务器

```bash
pnpm run start:local
```
## 测试

### 单元测试

```bash
pnpm run unit:test
```

### 集成测试

```bash
pnpm run e2e:test
```

## 部署

```bash
pnpm run deploy
```

