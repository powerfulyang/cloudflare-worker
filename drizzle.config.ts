import type { Config } from 'drizzle-kit'

export default {
  dialect: 'sqlite',
  schema: './drizzle/schema',
  out: './drizzle',
  driver: 'expo',
} satisfies Config
