declare global {
  interface Bindings {
    DB: D1Database
    AI: Ai
    ALLOW_IPS: string
    MY_BUCKET: R2Bucket
    ENVIRONMENT: 'development' | undefined
    GEMINI_PRO_API_KEY: string
  }
}

export {}
