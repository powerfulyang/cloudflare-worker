declare global {
  interface Bindings {
    DB: D1Database
    BUCKET: R2Bucket
    ENVIRONMENT: 'staging' | 'production'
    BUCKET_NAME: string
    JWT_SECRET: string
  }
}

export {}
