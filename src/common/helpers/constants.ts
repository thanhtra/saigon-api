import { CustomerType, RentalAmenity, UserRole } from "./enum";

export const StatusProduct = [
    {
        value: "InSell",
        label: "Đang bán"
    },
    {
        value: "OutOfStock",
        label: "Hết hàng"
    },
    {
        value: "OnSale",
        label: "Đang giảm giá"
    },
];

export const UserRoleOptions: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị hệ thống',
    [UserRole.Sale]: 'Người bán hàng',
    [UserRole.Owner]: 'Chủ trọ',
    [UserRole.Broker]: 'Môi giới',
    [UserRole.Tenant]: 'Khách hàng',
};

export const RentalAmenityOptions: Record<RentalAmenity, string> = {
    [RentalAmenity.FULL_FURNISHED]: 'Đầy đủ nội thất',
    [RentalAmenity.MEZZANINE]: 'Có gác',
    [RentalAmenity.KITCHEN_SHELF]: 'Có kệ bếp',
    [RentalAmenity.AIR_CONDITIONER]: 'Có máy lạnh',
    [RentalAmenity.WASHING_MACHINE]: 'Có máy giặt',
    [RentalAmenity.REFRIGERATOR]: 'Có tủ lạnh',
    [RentalAmenity.ELEVATOR]: 'Có thang máy',
    [RentalAmenity.NO_LIVE_WITH_OWNER]: 'Không chung chủ',
    [RentalAmenity.FREE_TIME]: 'Giờ giấc tự do',
    [RentalAmenity.SECURITY_24_7]: 'Có bảo vệ 24/24',
    [RentalAmenity.BASEMENT_PARKING]: 'Có hầm để xe',
};


export const CustomerTypeOptions: Record<CustomerType, string> = {
    [CustomerType.OWNER]: 'Chủ nhà',
    [CustomerType.BROKER]: 'Môi giới',
    [CustomerType.TENANT]: 'Người thuê nhà',
};