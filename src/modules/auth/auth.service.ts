import {
  Injectable,
  Inject,
  forwardRef,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import { DataRes } from 'src/common/dtos/respones.dto';
import { getPermissionsFromRoles } from 'src/common/helpers/utils';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UpdatePassworDto } from './dto/update-password.dto';
import { ChangePassworDto } from './dto/change-password.dto';

export interface TokenPayload {
  sub: string;
  username: string;
}

interface LoginUser {
  id: string;
  phone: string;
  role: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  // ---------------- LOGIN ----------------
  async login(user: LoginUser): Promise<DataRes<any>> {
    try {
      const payload: TokenPayload = {
        sub: user.id,
        username: user.phone,
      };

      const tokens = this.getTokens(payload);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return DataRes.success({
        user,
        tokens,
        permissions: getPermissionsFromRoles(user.role),
      });
    } catch (error) {
      return DataRes.failed(error?.message || 'Login thất bại');
    }
  }

  // ---------------- REFRESH TOKENS ----------------
  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<DataRes<{ accessToken: string; refreshToken: string }>> {
    try {
      const user = await this.usersRepository.findOneUser(userId);
      if (!user || !user.refresh_token) {
        throw new ForbiddenException('Access Denied');
      }

      const isValid = await argon2.verify(user.refresh_token, refreshToken);
      if (!isValid) {
        throw new ForbiddenException('Access Denied');
      }

      const payload: TokenPayload = {
        sub: user.id,
        username: user.phone,
      };

      const tokens = this.getTokens(payload);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return DataRes.success(tokens);
    } catch (error) {
      return DataRes.failed(error?.message || 'Refresh token thất bại');
    }
  }

  // ---------------- LOGOUT ----------------
  async logout(user: { id: string }): Promise<DataRes<null>> {
    try {
      await this.updateRefreshToken(user.id, null);
      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(error?.message || 'Logout thất bại');
    }
  }

  // ---------------- PASSWORD ----------------
  async updatePassword(dto: UpdatePassworDto): Promise<DataRes<null>> {
    try {
      if (dto.new_password !== dto.confirm_password) {
        return DataRes.failed('Mật khẩu không khớp');
      }

      const user = await this.usersRepository.findOneUserByPhone(dto.phone);
      if (!user) return DataRes.failed('User không tồn tại');

      await this.usersRepository.update(user.id, {
        password: await argon2.hash(dto.new_password),
        refresh_token: null,
      });

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(error?.message || 'Update password thất bại');
    }
  }

  async changePassword(
    dto: ChangePassworDto,
    user: { id: string },
  ): Promise<DataRes<null>> {
    try {
      if (dto.new_password !== dto.confirm_password) {
        return DataRes.failed('Mật khẩu không khớp');
      }

      const userDetail = await this.usersRepository.findOneUser(user.id);
      if (!userDetail) return DataRes.failed('User không tồn tại');

      const isValid = await argon2.verify(
        userDetail.password,
        dto.old_password,
      );
      if (!isValid) return DataRes.failed('Mật khẩu cũ không đúng');

      await this.usersRepository.update(user.id, {
        password: await argon2.hash(dto.new_password),
        refresh_token: null,
      });

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(error?.message || 'Đổi mật khẩu thất bại');
    }
  }

  async getUserByPhone(phone: string) {
    return this.usersRepository.findOneUserByPhone(phone);
  }

  // ---------------- TOKENS ----------------
  private getTokens(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwtAccessTokenSecret'),
      expiresIn: this.configService.get('auth.jwtAccessTokenExpirationTime'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwtRefreshTokenSecret'),
      expiresIn: this.configService.get('auth.jwtRefreshExpirationTime'),
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    const hashed = refreshToken ? await argon2.hash(refreshToken) : null;
    await this.usersRepository.update(userId, { refresh_token: hashed });
  }

}
