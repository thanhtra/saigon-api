import * as dotenv from 'dotenv';
dotenv.config();
const projectFrontendUrl =
  process.env.PROJECT_FRONTEND_URL || 'https://www.daknong.info';

export default () => ({
  projectName: process.env.PROJECT_NAME || 'Vi Rung API',
  projectFrontendUrl: projectFrontendUrl,
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'JWT_ACCESS_TOKEN_SECRET',
    jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '15m', //15m

    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'JWT_REFRESH_TOKEN_SECRET',
    jwtRefreshExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '1d', //1d

    passwordSaltRounds: process.env.AUTH_PASSWORDS_SALT_ROUNDS || 10,
  },
  throttleTtl: process.env.THROTTLE_TTL || 60,
  throttleLimit: process.env.THROTTLE_LIMIT || 100,
});
