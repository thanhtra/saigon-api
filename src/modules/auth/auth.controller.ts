import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
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

interface AuthRequest extends Request {
  user?: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // ---------------- LOGIN ----------------
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthRequest): Promise<DataRes<any>> {
    return await this.authService.login(req.user);
  }

  // ---------------- REFRESH TOKEN ----------------
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshTokens(@Request() req: AuthRequest): Promise<DataRes<any>> {
    return await this.authService.refreshTokens(req);
  }

  // ---------------- LOGOUT ----------------
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.logout)
  @Post('logout')
  async logout(@Request() req: AuthRequest): Promise<DataRes<any>> {
    return await this.authService.logout(req.user);
  }

  // ---------------- UPDATE PASSWORD (FORGOT/RESET) ----------------
  @Public()
  @Put('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePassworDto): Promise<DataRes<any>> {
    return await this.authService.updatePassword(updatePasswordDto);
  }

  // ---------------- CHANGE PASSWORD (USER LOGGED IN) ----------------
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.logout)
  @Put('change-password')
  async changePassword(
    @Request() req: AuthRequest,
    @Body() changePassworDto: ChangePassworDto
  ): Promise<DataRes<any>> {
    return await this.authService.changePassword(changePassworDto, req.user);
  }
}
