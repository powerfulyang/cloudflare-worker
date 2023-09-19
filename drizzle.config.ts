import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema",
  out: "./drizzle",
  driver: "better-sqlite",
} satisfies Config;
