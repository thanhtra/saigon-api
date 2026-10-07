import { join } from "path";
import { CustomerType, FurnitureStatus, HouseDirection, LandAmenity, LegalStatus, ProductStatus, RentalAmenity, RentalType, UserRole, WaterUnit } from "./enum";


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

export const WaterUnitOptions: Record<WaterUnit, string> = {
    [WaterUnit.PerM3]: 'đ / m³',
    [WaterUnit.PerPerson]: 'đ / người',
};


export const PRICE_LEVEL_MAP = {
    a: { min: 0, max: 3000000 },
    b: { min: 3000000, max: 4000000 },
    c: { min: 4000000, max: 5000000 },
    d: { min: 5000000, max: 6000000 },
    e: { min: 6000000, max: 7000000 },
    f: { min: 7000000, max: 8000000 },
    g: { min: 8000000, max: 9000000 },
    h: { min: 9000000, max: 10000000 },
    i: { min: 10000000, max: 15000000 },
    j: { min: 15000000, max: 20000000 },
    k: { min: 20000000, max: 25000000 },
    l: { min: 25000000, max: 35000000 },
    m: { min: 35000000, max: 50000000 },
    n: { min: 50000000, max: null },
};

export const PriceLevelLabels = {
    a: '< 3',
    b: '3 - 4',
    c: '4 - 5',
    d: '5 - 6',
    e: '6 - 7',
    f: '7 - 8',
    g: '8 - 9',
    h: '9 - 10',
    i: '10 - 15',
    j: '15 - 20',
    k: '20 - 25',
    l: '25 - 35',
    m: '35 - 50',
    n: '> 50',
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

export const DATETIME_LOCAL_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;


export const PRICE_LAND_LEVEL_MAP = {
    a: { min: 0, max: 3 },
    b: { min: 3, max: 4 },
    c: { min: 4, max: 5 },
    d: { min: 5, max: 6 },
    e: { min: 6, max: 7 },
    f: { min: 7, max: 8 },
    g: { min: 8, max: 9 },
    h: { min: 9, max: 10 },
    i: { min: 10, max: 15 },
    j: { min: 15, max: 20 },
    k: { min: 20, max: 25 },
    l: { min: 25, max: 35 },
    m: { min: 35, max: 50 },
    n: { min: 50, max: null },
};

export const ACREAGE_LAND_LEVEL_MAP = {
    a: { min: 0, max: 30 },
    b: { min: 30, max: 50 },
    c: { min: 50, max: 80 },
    d: { min: 80, max: 100 },
    e: { min: 100, max: 150 },
    f: { min: 150, max: 200 },
    g: { min: 200, max: 250 },
    h: { min: 250, max: 300 },
    i: { min: 300, max: 500 },
    j: { min: 500, max: null },
};

export const LandAmenityOptions: Record<LandAmenity, string> = {
    [LandAmenity.CarAccessible]: 'Đường ô tô',
    [LandAmenity.StreetFront]: 'Mặt phố',
    [LandAmenity.BusinessAllowed]: 'Kinh doanh',
    [LandAmenity.CashFlow]: 'Dòng tiền',
    [LandAmenity.Elevator]: 'Thang máy'
};

export const HouseDirectionOptions: Record<HouseDirection, string> = {
    [HouseDirection.East]: 'Đông',
    [HouseDirection.West]: 'Tây',
    [HouseDirection.South]: 'Nam',
    [HouseDirection.North]: 'Bắc',
    [HouseDirection.NorthEast]: 'Đông Bắc',
    [HouseDirection.NorthWest]: 'Tây Bắc',
    [HouseDirection.SouthEast]: 'Đông Nam',
    [HouseDirection.SouthWest]: 'Tây Nam',
    [HouseDirection.Updating]: 'Đang cập nhật',
};

export const LegalStatusOptions: Record<LegalStatus, string> = {
    [LegalStatus.RedBook]: 'Sổ đỏ / Sổ hồng',
    [LegalStatus.PendingRedBook]: 'Đang chờ sổ',
    [LegalStatus.Handwritten]: 'Giấy tay',
    [LegalStatus.SaleContract]: 'Hợp đồng mua bán',
    [LegalStatus.PlanningPending]: 'Đang chờ pháp lý / Quy hoạch',
    [LegalStatus.Updating]: 'Đang cập nhật',
};

export const FurnitureStatusOptions: Record<FurnitureStatus, string> = {
    [FurnitureStatus.Full]: 'Nội thất đầy đủ',
    [FurnitureStatus.Basic]: 'Nội thất cơ bản',
    [FurnitureStatus.None]: 'Không nội thất',
    [FurnitureStatus.Updating]: 'Đang cập nhật',
};


