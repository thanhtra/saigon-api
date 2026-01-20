import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DataRes } from 'src/common/dtos/respones.dto';
import { PasswordUtil } from 'src/common/helpers/password';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { ChangePassworDto } from './dto/change-password.dto';
import { TokenPayload } from 'src/common/interface/common';
import { CollaboratorsRepository } from '../collaborators/collaborators.repository';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly collaboratorsRepository: CollaboratorsRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }


  async login(user: any) {
    const payload: TokenPayload = {
      sub: user.id,
      username: user.phone,
      pv: user.password_version
    };

    const tokens = this.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }


  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {

    const user = await this.usersRepository.findOneUser(userId);
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const isValid = await PasswordUtil.verify(user.refresh_token, refreshToken);
    if (!isValid) {
      throw new ForbiddenException('Access Denied');
    }

    const payload: TokenPayload = {
      sub: user.id,
      username: user.phone,
      pv: user.password_version
    };

    const tokens = this.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(user: { id: string }): Promise<boolean> {
    await this.updateRefreshToken(user.id, null);
    return true;
  }

  async resetPassword(
    userId: string
  ): Promise<DataRes<{ password: string }>> {
    try {
      const user = await this.usersRepository.findOneUser(userId);
      if (!user) {
        return DataRes.failed('Người dùng không tồn tại');
      }

      const newPassword = this.generateRandomPassword(6);
      const hashedPassword = await PasswordUtil.hash(newPassword);

      await this.usersRepository.updatePassword(
        userId,
        hashedPassword,
      );

      return DataRes.success({ password: newPassword });
    } catch (error) {
      return DataRes.failed('Reset mật khẩu thất bại');
    }
  }

  async changePassword(
    dto: ChangePassworDto,
    user: any,
  ): Promise<DataRes<null>> {
    try {
      const { id } = user;
      const userDetail = await this.usersRepository.findOneUser(id);
      if (!userDetail) return DataRes.failed('User không tồn tại');

      const isValid = await PasswordUtil.verify(
        userDetail.password,
        dto.old_password,
      );
      if (!isValid) return DataRes.failed('Mật khẩu cũ không đúng');

      const hashedPassword = await PasswordUtil.hash(dto.new_password);

      await this.usersRepository.updatePassword(
        user.id,
        hashedPassword,
      );

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed('Đổi mật khẩu thất bại');
    }
  }

  async getUserByPhone(phone: string) {
    return this.usersRepository.findOneUserByPhone(phone);
  }

  async getUserById(id: string) {
    return this.usersRepository.findOneUser(id);
  }

  async getCollaboratorByUserId(userId: string) {
    return this.collaboratorsRepository.findByUserId(userId);
  }


  // ---------------- TOKENS ----------------
  private getTokens(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtAccessTokenSecret'),
      expiresIn: this.configService.get<string>('auth.jwtAccessTokenExpirationTime'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtRefreshTokenSecret'),
      expiresIn: this.configService.get<string>('auth.jwtRefreshExpirationTime'),
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashedToken = refreshToken
      ? await PasswordUtil.hash(refreshToken)
      : null;

    await this.usersRepository.updateRefreshToken(
      userId,
      hashedToken,
    );
  }


  private generateRandomPassword(length = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }


}
