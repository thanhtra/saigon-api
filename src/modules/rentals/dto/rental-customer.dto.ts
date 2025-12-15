import { Amenity } from 'src/modules/amenities/entities/amenitie.entity';
import { Upload } from 'src/modules/uploads/entities/upload.entity';
import { RentalType } from 'src/common/helpers/enum';

export class RentalCustomerDto {
    title: string;
    rental_type: RentalType;
    address_detail: string;
    price?: number;
    total_rooms: number;
    amenities: Amenity[];
    uploads: Upload[];
}
