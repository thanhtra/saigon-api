import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/respones.dto';
import { BookingStatus } from 'src/common/helpers/enum';

export class QueryMyBookingDto extends PageOptionsDto {

    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus;

}
