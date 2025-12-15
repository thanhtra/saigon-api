import { Injectable, Inject, forwardRef, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { DataRes } from 'src/common/dtos/respones.dto';
import { getPermissionsFromRoles } from 'src/common/helpers/utils';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UpdatePassworDto } from './dto/update-password.dto';
import { ChangePassworDto } from './dto/change-password.dto';
import { UserRole } from 'src/common/helpers/enum';

export interface TokenPayload {
  sub: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersRepository: UsersRepository,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) { }

  // ---------------- LOGIN ----------------
  async login(user: any): Promise<DataRes<any>> {
    try {
      const payload: TokenPayload = { sub: user.id, username: user.phone };
      const tokens = await this.getTokens(payload);

      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return DataRes.success({
        ...user,
        tokens,
        permissions: getPermissionsFromRoles(user.role),
      });
    } catch (error) {
      return DataRes.failed(error?.message || 'Login thất bại');
    }
  }

  // ---------------- REFRESH TOKENS ----------------
  async refreshTokens(req: any): Promise<DataRes<any>> {
    try {
      const { user } = req;
      const resUser = await this.usersService.getUser(user.sub);

      if (!resUser.success || !resUser.data?.refresh_token) {
        throw new ForbiddenException('Access Denied');
      }

      const isValid = await argon2.verify(resUser.data.refresh_token, user.refreshToken);
      if (!isValid) throw new ForbiddenException('Access Denied');

      const accessToken = await this.getAccessToken({
        sub: resUser.data.id,
        username: resUser.data.phone,
      });

      return DataRes.success({ accessToken });
    } catch (error) {
      return DataRes.failed(error?.message || 'Không thể tạo access token mới');
    }
  }

  // ---------------- LOGOUT ----------------
  async logout(user: any): Promise<DataRes<null>> {
    try {
      await this.updateRefreshToken(user?.id, null);
      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(error?.message || 'Logout thất bại');
    }
  }

  // ---------------- PASSWORD ----------------
  async updatePassword(dto: UpdatePassworDto): Promise<DataRes<null>> {
    try {
      if (dto.new_password !== dto.confirm_password) {
        return DataRes.failed('Mật khẩu mới và xác nhận mật khẩu không khớp');
      }

      const user = await this.usersRepository.findOneUserByPhone(dto.phone);
      if (!user || user.role !== UserRole.User) {
        return DataRes.failed('Không thể cập nhật mật khẩu');
      }

      await this.usersRepository.update(user.id, { password: await argon2.hash(dto.new_password) });
      await this.updateRefreshToken(user.id, null);

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(error?.message || 'Cập nhật mật khẩu thất bại');
    }
  }

  async changePassword(dto: ChangePassworDto, user: any): Promise<DataRes<null>> {
    try {
      if (dto.new_password !== dto.confirm_password) {
        return DataRes.failed('Mật khẩu mới và xác nhận mật khẩu không khớp');
      }

      const userDetail = await this.usersRepository.findOneUser(user?.id);
      if (!userDetail || userDetail.role !== UserRole.User) {
        return DataRes.failed('Không thể đổi mật khẩu');
      }

      const isValid = await argon2.verify(userDetail.password, dto.old_password);
      if (!isValid) return DataRes.failed('Mật khẩu cũ không đúng');

      await this.usersRepository.update(user.id, { password: await argon2.hash(dto.new_password) });
      await this.updateRefreshToken(user.id, null);

      return DataRes.success(null);
    } catch (error) {
      return DataRes.failed(error?.message || 'Đổi mật khẩu thất bại');
    }
  }

  // ---------------- TOKENS ----------------
  private async getTokens(payload: TokenPayload) {
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

  private async getAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwtAccessTokenSecret'),
      expiresIn: this.configService.get('auth.jwtAccessTokenExpirationTime'),
    });
  }

  private async updateRefreshToken(userId: string, refreshToken: string | null) {
    const hashed = refreshToken ? await argon2.hash(refreshToken) : null;
    await this.usersRepository.update(userId, { refresh_token: hashed });
  }

  async getUserByPhone(phone: string) {
    return this.usersService.findOneByPhone(phone);
  }
}
