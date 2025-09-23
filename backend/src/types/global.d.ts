declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      MONGODB_URI: string;
      FRONTEND_URL: string;
      RATE_LIMIT_WINDOW_MS?: string;
      RATE_LIMIT_MAX_REQUESTS?: string;
    }
  }
}

export {};
