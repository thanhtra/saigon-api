import { Body, Controller, Get, Post, Put, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DataRes } from 'src/common/dtos/respones.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { UpdatePassworDto } from './dto/update-password.dto';
import { ChangePassworDto } from './dto/change-password.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { createCookieConfig } from 'src/config/cookie.config';
import { ConfigService } from '@nestjs/config';


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


  // ---------------- GET CURRENT USER ----------------
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @Req() req: AuthRequest,
  ): Promise<DataRes<any>> {
    return DataRes.success(req.user);
  }

  // ---------------- LOGIN ----------------
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DataRes<any>> {
    const result = await this.authService.login(req.user);

    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }

    const { user, tokens } = result.data;
    const { accessToken, refreshToken } = tokens;

    res.cookie('accessToken', accessToken, this.cookieConfig.accessToken);
    res.cookie('refreshToken', refreshToken, this.cookieConfig.refreshToken);

    return DataRes.success(user);
  }


  // ---------------- REFRESH TOKEN ----------------
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshTokens(
      req.user.sub,
      req.refreshToken,
    );

    if (!result.success) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = result.data;

    res.cookie('accessToken', accessToken, this.cookieConfig.accessToken);
    res.cookie('refreshToken', refreshToken, this.cookieConfig.refreshToken);

    return { success: true };
  }


  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.logout)
  @Post('logout')
  async logout(
    @Request() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DataRes<null>> {
    await this.authService.logout(req.user);

    // 🔥 CLEAR COOKIE
    res.clearCookie('accessToken', this.cookieConfig.accessToken);
    res.clearCookie('refreshToken', this.cookieConfig.refreshToken);

    return DataRes.success(null, 'Logout thành công');
  }


  // ---------------- UPDATE PASSWORD (FORGOT) ----------------
  @Public()
  @Put('update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePassworDto,
  ): Promise<DataRes<any>> {
    return await this.authService.updatePassword(updatePasswordDto);
  }

  // ---------------- CHANGE PASSWORD (LOGGED IN) ----------------
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.logout)
  @Put('change-password')
  async changePassword(
    @Request() req: AuthRequest,
    @Body() changePassworDto: ChangePassworDto,
  ): Promise<DataRes<any>> {
    return await this.authService.changePassword(changePassworDto, req.user);
  }
}
