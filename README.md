# 一个较为完备的 Cloudflare Workers 教程

## 介绍

本教程将带你从零开始，一步步学习如何使用 Cloudflare Workers 搭建一个属于自己的网站。

## 安装依赖

```bash
npm install
```

### 配置 wrangler

设置 `wrangler.toml` 中 d1_database 字段为你的数据库相关信息
具体内容类似下面：

```toml
[[d1_databases]]
binding = "DB"
database_name = "<database-name>"
database_id = "<database-id>"
```

设置 AI worker

```toml
[ai]
binding = "AI"
```

### D1 database

> 相关文档: https://developers.cloudflare.com/workers/wrangler/commands/#d1

- 创建数据库, 执行 `npm run d1:create`

```bash
wrangler d1 create <database-name>
```

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
