import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PHONE_REGEX } from 'src/common/helpers/utils';


export class RegisterAfterBookingDto {
    @IsString()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @Matches(PHONE_REGEX, { message: 'Số điện thoại không hợp lệ' })
    phone: string;

    @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
    password: string;
}
