export default () => ({
  /* ================= PROJECT ================= */
  projectName: process.env.PROJECT_NAME,

  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',

  port: Number(process.env.PORT),

  /* ================= FRONTEND ================= */
  frontend: {
    adminUrl: process.env.FRONTEND_ADMIN_URL,
    customerUrl: process.env.FRONTEND_CUSTOMER_URL,
  },

  /* ================= DATABASE ================= */
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    name: process.env.DATABASE_NAME,

    maxPool: Number(process.env.DATABASE_MAX_POOL),
    minPool: Number(process.env.DATABASE_MIN_POOL),
    ssl: process.env.DATABASE_SSL === 'true',
  },

  /* ================= AUTH ================= */
  auth: {
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },

  /* ================= SECURITY ================= */
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAMESITE as 'lax' | 'none',
    domain: process.env.COOKIE_DOMAIN || undefined,
  },

  /* ================= THROTTLE ================= */
  throttle: {
    ttl: Number(process.env.THROTTLE_TTL),
    limit: Number(process.env.THROTTLE_LIMIT),
  },
});
