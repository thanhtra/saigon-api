import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { DataRes } from 'src/common/dtos/respones.dto';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/config/permissions';
import { UpdatePassworDto } from './dto/update-password.dto';
import { ChangePassworDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<DataRes<any>> {
    return await this.authService.login(req.user);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  refreshTokens(@Request() req) {
    return this.authService.refreshTokens(req);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.logout)
  @Post('logout')
  async logout(@Request() req): Promise<DataRes<any>> {
    return await this.authService.logout(req?.user);
  }

  @Public()
  @Put('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePassworDto): Promise<DataRes<any>> {
    return await this.authService.updatePassword(updatePasswordDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.users.logout)
  @Put('change-password')
  async changePassword(@Request() req, @Body() changePassworDto: ChangePassworDto): Promise<DataRes<any>> {
    return await this.authService.changePassword(changePassworDto, req.user);
  }

}
