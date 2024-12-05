declare global {
  interface Bindings {
    DB: D1Database
    KV: KVNamespace
    ENVIRONMENT: 'local' | 'production'
    JWT_SECRET: string
  }
}

export {}
