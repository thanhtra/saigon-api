import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class UpdatePassworDto {
    @IsString()
    @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Số điện thoại không đúng'
    })
    phone: string;

    @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
    @IsString()
    @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
    new_password: string;

    @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
    @IsString()
    @MinLength(6)
    confirm_password: string;
}
