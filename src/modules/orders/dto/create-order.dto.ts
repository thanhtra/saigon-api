import {
    IsOptional,
    IsString
} from 'class-validator';

export class CreateOrderDto {
    @IsString()
    user_id: string;

    @IsString()
    order_detail: string;

    @IsString()
    shipping_address: string;

    @IsString()
    @IsOptional()
    note: string;

    @IsString()
    @IsOptional()
    status: string;


    static getEnums() {
        return {
            user_id: 'Người dùng',
            status: 'Trạng thái đơn hàng',
            order_code: 'Mã đặt hàng',
        };
    }
}
