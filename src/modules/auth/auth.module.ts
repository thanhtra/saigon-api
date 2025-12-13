import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    // Need to use registerAsync below in order to inject the configService
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('auth.jwtAccessTokenSecret'),
    //     signOptions: {
    //       expiresIn: configService.get<string>('auth.jwtAccessTokenExpirationTime'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, LocalStrategy, AccessTokenStrategy, UsersRepository],
  exports: [AuthService],
})
export class AuthModule { }
