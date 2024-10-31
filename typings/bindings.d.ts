declare global {
  interface Bindings {
    DB: D1Database
    MY_BUCKET: R2Bucket
    ENVIRONMENT: 'development' | undefined
  }
}

export {}
