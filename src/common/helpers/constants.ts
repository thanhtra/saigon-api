import { join } from "path";
import { CustomerType, ProductStatus, RentalAmenity, RentalType, UserRole } from "./enum";


export const UPLOAD_DIR = join(process.cwd(), 'uploads');

export const UserRoleOptions: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị hệ thống',
    [UserRole.Sale]: 'Người bán hàng',
    [UserRole.Owner]: 'Chủ trọ',
    [UserRole.Broker]: 'Môi giới',
    [UserRole.Tenant]: 'Khách hàng',
};

export const RentalAmenityOptions: Record<RentalAmenity, string> = {
    [RentalAmenity.FullFurnished]: 'Nội thất đầy đủ',
    [RentalAmenity.Toilet]: 'WC riêng',
    [RentalAmenity.Mezzanine]: 'Gác lửng',
    [RentalAmenity.KitchenShelf]: 'Kệ bếp',
    [RentalAmenity.AirConditioner]: 'Máy lạnh',
    [RentalAmenity.WashingMachine]: 'Máy giặt',
    [RentalAmenity.Refrigerator]: 'Tủ lạnh',
    [RentalAmenity.Elevator]: 'Thang máy',
    [RentalAmenity.NoLiveWithOwner]: 'Không chung chủ',
    [RentalAmenity.FreeTime]: 'Giờ giấc tự do',
    [RentalAmenity.Security247]: 'An ninh 24/7',
    [RentalAmenity.BasementParking]: 'Chỗ để xe',
    [RentalAmenity.PetAllowed]: 'Nuôi thú cưng',
    [RentalAmenity.ElectricMotorbike]: 'Xe máy điện',
    [RentalAmenity.Window]: 'Cửa sổ',
    [RentalAmenity.Balcony]: 'Ban công',
};


export const CustomerTypeOptions: Record<CustomerType, string> = {
    [CustomerType.Owner]: 'Chủ nhà',
    [CustomerType.Broker]: 'Môi giới',
    [CustomerType.Tenant]: 'Khách hàng',
};

export const ProductStatusOptions: Record<ProductStatus, string> = {
    [ProductStatus.New]: 'Tin mới',
    [ProductStatus.Update]: 'Có chỉnh sửa',
    [ProductStatus.Pending]: 'Cần cập nhật',
    [ProductStatus.Confirmed]: 'Đã xác nhận',
    [ProductStatus.Cancelled]: 'Đã hủy',
};

export const UNIT_RENTAL_TYPES = [
    RentalType.WholeHouse,
    RentalType.Apartment,
    RentalType.BusinessPremises,
] as const;

export type UnitRentalType = typeof UNIT_RENTAL_TYPES[number];

export const isUnitRental = (
    type: RentalType,
): type is UnitRentalType => {
    return UNIT_RENTAL_TYPES.includes(type as UnitRentalType);
};


export const PRICE_LEVEL_MAP = {
    a: { min: 0, max: 2000000 },
    b: { min: 2000000, max: 3000000 },
    c: { min: 3000000, max: 5000000 },
    d: { min: 5000000, max: 7000000 },
    e: { min: 7000000, max: 10000000 },
    f: { min: 10000000, max: 15000000 },
    g: { min: 15000000, max: 25000000 },
    h: { min: 25000000, max: null },
};

export const ACREAGE_LEVEL_MAP = {
    a: { min: 0, max: 20 },
    b: { min: 20, max: 30 },
    c: { min: 30, max: 50 },
    d: { min: 50, max: 70 },
    e: { min: 70, max: 90 },
    f: { min: 90, max: 120 },
    g: { min: 120, max: null },
};