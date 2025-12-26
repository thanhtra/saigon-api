import { CustomerType, ProductStatus, RentalAmenity, RentalType, UserRole } from "./enum";

export const UserRoleOptions: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị hệ thống',
    [UserRole.Sale]: 'Người bán hàng',
    [UserRole.Owner]: 'Chủ trọ',
    [UserRole.Broker]: 'Môi giới',
    [UserRole.Tenant]: 'Khách hàng',
};

export const RentalAmenityOptions: Record<RentalAmenity, string> = {
    [RentalAmenity.FullFurnished]: 'Đầy đủ nội thất',
    [RentalAmenity.Mezzanine]: 'Có gác',
    [RentalAmenity.KitchenShelf]: 'Có kệ bếp',
    [RentalAmenity.AirConditioner]: 'Có máy lạnh',
    [RentalAmenity.WashingMachine]: 'Có máy giặt',
    [RentalAmenity.Refrigerator]: 'Có tủ lạnh',
    [RentalAmenity.Elevator]: 'Có thang máy',
    [RentalAmenity.NoLiveWithOwner]: 'Không chung chủ',
    [RentalAmenity.FreeTime]: 'Giờ giấc tự do',
    [RentalAmenity.Security247]: 'Có bảo vệ 24/24',
    [RentalAmenity.BasementParking]: 'Có hầm để xe',
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