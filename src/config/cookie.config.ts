import { ConfigService } from '@nestjs/config';

export const createCookieConfig = (config: ConfigService) => ({
    accessToken: {
        httpOnly: true,
        secure: config.get('COOKIE_SECURE') === 'true',
        sameSite: config.get<'lax' | 'none'>('COOKIE_SAMESITE'),
        domain: config.get('COOKIE_DOMAIN') || undefined,
        path: '/',
    },
    refreshToken: {
        httpOnly: true,
        secure: config.get('COOKIE_SECURE') === 'true',
        sameSite: config.get<'lax' | 'none'>('COOKIE_SAMESITE'),
        domain: config.get('COOKIE_DOMAIN') || undefined,
        path: '/',
    },
});
