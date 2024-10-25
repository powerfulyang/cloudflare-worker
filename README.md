# 一个较为完备的 Cloudflare Workers 教程

## 介绍

本教程将带你从零开始，一步步学习如何使用 Cloudflare Workers 开发专属于你的 API 服务。

## 安装依赖

推荐使用 `pnpm` 安装依赖

```bash
pnpm install
```

### 配置 wrangler

设置 `wrangler.toml` 中 d1_database 字段为你的数据库相关信息 (**必须**)
具体内容类似下面：

```toml
[[d1_databases]]
binding = "DB"
database_name = "<database-name>"
database_id = "<database-id>"
```

设置 AI worker (**非必须**)

```toml
[ai]
binding = "AI"
```

### D1 database

> 相关文档: https://developers.cloudflare.com/workers/wrangler/commands/#d1

### 开启本地开发

- 执行 SQL 语句, 执行 `npm run d1:execute`

```bash
wrangler d1 execute <database-name> --file <sql-file>
```

## 开发

```bash
npm run start:remote
```

## 部署

```bash
npm run deploy
```
