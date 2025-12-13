import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataRes } from 'src/common/dtos/respones.dto';
import { getPermissionsFromRoles } from '../../common/helpers/utils';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { UpdatePassworDto } from './dto/update-password.dto';
import { UsersRepository } from '../users/users.repository';
import { UserRoles } from 'src/config/userRoles';
import { ChangePassworDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

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

  async login(user: any): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const payload: TokenPayload = { sub: user.id, username: user.phone };
      const tokens = await this.getTokens(payload);

      const data = {
        ...user,
        tokens,
        permissions: getPermissionsFromRoles(user.role),
      };

      await this.updateRefreshToken(user.id, tokens.refreshToken);

      res.setSuccess(data);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async refreshTokens(req: any): Promise<DataRes<any>> {
    var result = new DataRes<any>();

    try {
      const { user } = req;
      const userId = user['sub'];
      const refreshToken = user['refreshToken'];

      const res = await this.usersService.getUser(userId);
      if (!res.success) {
        throw new ForbiddenException('Access Denied');
      }

      const userDetail = res.data;

      if (!userDetail || !userDetail.refresh_token) {
        throw new ForbiddenException('Access Denied');
      }

      const refreshTokenMatches = await argon2.verify(userDetail.refresh_token, refreshToken);
      if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

      const tp: TokenPayload = {
        sub: userDetail.id,
        username: user.username
      }
      const accessToken = await this.getAccessToken(tp);

      if (accessToken) {
        result.setSuccess({ accessToken });
      } else {
        result.setFailed("Can not create new access token!");
      }

    } catch (ex) {
      result.setFailed(ex.message);
    };

    return result;
  }

  async getUserByPhone(phone: string) {
    return await this.usersService.findOneByPhone(phone);
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = refreshToken ? await argon2.hash(refreshToken) : null;
    await this.usersRepository.updateUser(userId, { refresh_token: hashedRefreshToken });
  }

  async getTokens(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: this.configService.get('auth.jwtAccessTokenSecret'),
        expiresIn: this.configService.get('auth.jwtAccessTokenExpirationTime')
      }),
      this.jwtService.sign(payload, {
        secret: this.configService.get('auth.jwtRefreshTokenSecret'),
        expiresIn: this.configService.get('auth.jwtRefreshExpirationTime')
      })
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getAccessToken(payload: TokenPayload) {
    const accessToken = await this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwtAccessTokenSecret'),
      expiresIn: this.configService.get('auth.jwtAccessTokenExpirationTime')
    });

    return accessToken || "";
  }

  async logout(user: any): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const data = await this.updateRefreshToken(user?.id, null);

      res.setSuccess(null);
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async updatePassword(updatePassworDto: UpdatePassworDto): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const user = await this.usersRepository.findOneUserByPhone(updatePassworDto.phone);
      if (user && user.role !== UserRoles.Admin && user.role === UserRoles.User) {
        const userUpdated = await this.usersRepository.updateUser(user.id, { password: updatePassworDto.password });

        if (userUpdated) {
          await this.updateRefreshToken(user.id, null);
          res.setSuccess(null);
        } else {
          res.setFailed(null);
        }
      } else {
        res.setFailed(null);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }

  async changePassword(changePassworDto: ChangePassworDto, user: any): Promise<DataRes<any>> {
    var res = new DataRes<any>();

    try {
      const userDetail = await this.usersRepository.findOneUser(user?.id);

      if (userDetail && userDetail.role !== UserRoles.Admin && userDetail.role === UserRoles.User) {
        const isValid = await bcrypt.compare(changePassworDto.old_password, userDetail.password)
        if (isValid) {
          const userUpdated = await this.usersRepository.updateUser(user.id, { password: changePassworDto.new_password });

          if (userUpdated) {
            res.setSuccess(null);
            await this.updateRefreshToken(user.id, null);
          } else {
            res.setFailed(null);
          }
        }
      } else {
        res.setFailed(null);
      }
    } catch (ex) {
      res.setFailed(ex.message);
    }

    return res;
  }


}
