import { IsOptional, IsString, IsEnum, IsNumberString } from "class-validator";
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { RentalType } from 'src/common/helpers/enum';

export class QueryRentalDto extends PageOptionsDto {
    @IsString()
    @IsOptional()
    name?: string = ''; // lọc theo tên cho thuê

    @IsString()
    @IsOptional()
    district?: string = ''; // lọc theo quận/huyện nếu lưu tách ra

    @IsString()
    @IsOptional()
    ward?: string = ''; // lọc theo phường/xã nếu lưu tách ra

    @IsEnum(RentalType)
    @IsOptional()
    rentalType?: RentalType; // lọc theo loại cho thuê

    @IsNumberString()
    @IsOptional()
    minPrice?: string; // giá tối thiểu

    @IsNumberString()
    @IsOptional()
    maxPrice?: string; // giá tối đa

    @IsNumberString()
    @IsOptional()
    minRooms?: string; // số phòng tối thiểu

    @IsNumberString()
    @IsOptional()
    maxRooms?: string; // số phòng tối đa
}
