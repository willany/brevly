export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333',

  TIMEOUT: 10000,

  RETRY: {
    attempts: 3,
    delay: 1000,
  },

  ENV: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
} as const;

export const API_ENDPOINTS = {
  LINKS: {
    LIST: '/links',
    CREATE: '/links',
    DELETE: (id: string) => `/links/${id}`,
    GET: (id: string) => `/links/${id}`,
    REDIRECT: (shortUrl: string) => `/links/${shortUrl}/redirect`,
    ACCESS: (shortUrl: string) => `/links/${shortUrl}/access`,
    EXPORT: '/links/export',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
