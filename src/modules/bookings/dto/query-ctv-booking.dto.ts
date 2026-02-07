import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { BookingStatus } from 'src/common/helpers/enum';

export class QueryCTVBookingDto extends PageOptionsDto {

    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_paid_commission?: boolean;
}
