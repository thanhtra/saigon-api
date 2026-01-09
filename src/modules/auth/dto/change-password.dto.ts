import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePassworDto {
    @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
    @IsString()
    old_password: string;

    @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
    @IsString()
    @MinLength(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' })
    new_password: string;
}
