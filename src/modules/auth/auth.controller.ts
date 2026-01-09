import { Body, Controller, Get, Param, Post, Put, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { DataRes } from 'src/common/dtos/respones.dto';
import { toSafeUser } from 'src/common/helpers/api';
import { ErrorMes } from 'src/common/helpers/errorMessage';
import { createCookieConfig } from 'src/config/cookie.config';
import { PERMISSIONS } from 'src/config/permissions';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePassworDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';


interface AuthRequest extends Request {
  user?: any;
}

@Controller('auth')
export class AuthController {
  private readonly cookieConfig;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.cookieConfig = createCookieConfig(this.configService);
  }


  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @CurrentUser() user: User,
  ): Promise<DataRes<any>> {
    return DataRes.success(toSafeUser(user));
  }

  @Public()
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @Throttle(10, 60)
  @Post('login')
  async login(
    @CurrentUser() userReq: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DataRes<any>> {
    try {
      if (!userReq) {
        return DataRes.failed('USERNAME_PASSWORD_WRONG');
      }

      const { user, tokens } = await this.authService.login(userReq);

      res.cookie('accessToken', tokens.accessToken, this.cookieConfig.accessToken);
      res.cookie('refreshToken', tokens.refreshToken, this.cookieConfig.refreshToken);

      return DataRes.success(toSafeUser(user));
    } catch (error) {
      return DataRes.failed(ErrorMes.SYSTEM_ERROR);
    }
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DataRes<any>> {
    try {
      const tokens = await this.authService.refreshTokens(
        req.user.sub,
        req.refreshToken,
      );

      res.cookie('accessToken', tokens.accessToken, this.cookieConfig.accessToken);
      res.cookie('refreshToken', tokens.refreshToken, this.cookieConfig.refreshToken);

      return DataRes.success(null);
    } catch (error) {

      res.clearCookie('accessToken', this.cookieConfig.accessToken);
      res.clearCookie('refreshToken', this.cookieConfig.refreshToken);

      return DataRes.failed(ErrorMes.SYSTEM_ERROR);
    }
  }

  @Auth(PERMISSIONS.users.all_role)
  @Post('logout')
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DataRes<any>> {
    try {
      const success = await this.authService.logout(user);
      if (!success) {
        return DataRes.failed(ErrorMes.SYSTEM_ERROR);
      }

      res.clearCookie('accessToken', this.cookieConfig.accessToken);
      res.clearCookie('refreshToken', this.cookieConfig.refreshToken);

      return DataRes.success(null);
    } catch {
      return DataRes.failed(ErrorMes.SYSTEM_ERROR);
    }
  }

  @Post(':id/reset-password')
  @Auth(PERMISSIONS.users.update)
  async resetPassword(
    @Param('id') id: string,
  ): Promise<DataRes<{ password: string }>> {
    return await this.authService.resetPassword(id);
  }

  @Auth(PERMISSIONS.users.logout)
  @Put('change-password')
  async changePassword(
    @Request() req: AuthRequest,
    @Body() changePassworDto: ChangePassworDto,
  ): Promise<DataRes<any>> {
    return await this.authService.changePassword(changePassworDto, req.user);
  }

}
