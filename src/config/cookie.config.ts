import { ConfigService } from '@nestjs/config';

export const createCookieConfig = (config: ConfigService) => {
    const cookieConfig = config.get('cookie');

    return {
        accessToken: {
            httpOnly: true,
            secure: cookieConfig.secure,
            sameSite: cookieConfig.sameSite,
            domain: cookieConfig.domain,
            path: '/',
        },
        refreshToken: {
            httpOnly: true,
            secure: cookieConfig.secure,
            sameSite: cookieConfig.sameSite,
            domain: cookieConfig.domain,
            path: '/',
        },
    };
};
