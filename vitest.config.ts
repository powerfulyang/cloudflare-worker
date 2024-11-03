import { join } from 'node:path'
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineWorkersConfig(async () => {
  // Read all migrations in the `migrations` directory
  const migrationsPath = join(__dirname, 'drizzle')
  const migrations = await readD1Migrations(migrationsPath)
  return {
    plugins: [tsconfigPaths()],
    test: {
      globals: true,
      setupFiles: ['./.vitest/apply-migrations.ts'],
      poolOptions: {
        workers: {
          isolatedStorage: true,
          wrangler: {
            configPath: './wrangler.toml',
          },
          miniflare: {
            // Add a test-only binding for migrations, so we can apply them in a
            // setup file
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
      fileParallelism: false,
      sequence: {
        concurrent: false,
      },
    },
  }
})
