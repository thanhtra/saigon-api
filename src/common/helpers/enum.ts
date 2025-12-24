export enum Order {
    ASC = "ASC",
    DESC = "DESC",
}


export enum RentalType {
    BoardingHouse = 'boarding_house',   // Dãy trọ (nhiều phòng)
    WholeHouse = 'whole_house',         // Nhà nguyên căn (1 unit)
    Apartment = 'apartment',            // Chung cư (1 unit)
    BusinessPremises = 'business_premises', // Mặt bằng kinh doanh (1 unit)
}

export enum RentalStatus {
    New = 'new',               // Nhà mới được tạo, chưa xác nhận
    Confirmed = 'confirmed',   // Nhà đã được admin xác nhận
    Update = 'update',         // Nhà đã được chỉnh sửa sau khi tạo
    Cancelled = 'cancelled',   // Nhà đã bị huỷ hoặc xoá
}

export enum RoomStatus {
    Available = 'available',       // Trống
    Rented = 'rented',             // Đã thuê
    Deposited = 'deposited',       // Đã cọc
    Maintenance = 'maintenance',   // Bảo trì
}

export enum UserRole {
    Admin = 'admin_saigon',
    Sale = 'sale_saigon',
    Owner = 'owner',       // Chủ nhà
    Broker = 'broker',     // Môi giới
    Tenant = 'tenant',     // Khách hàng
}

export enum CollaboratorType {
    Owner = UserRole.Owner,       // Chủ nhà
    Broker = UserRole.Broker,     // Môi giới
}

export enum CustomerType {
    Owner = UserRole.Owner,     // Chủ nhà
    Broker = UserRole.Broker,   // Môi giới
    Tenant = UserRole.Tenant,   // Khách thuê / khách hàng
}



export enum BookingStatus {
    Pending = 'pending',       // Đã đặt lịch
    Confirmed = 'confirmed',   // Xác nhận với chủ trọ
    Completed = 'completed',   // Đã đi xem
    Cancelled = 'cancelled',   // Khách huỷ
    NoShow = 'no_show',        // Khách không đến
}

export enum CommissionStatus {
    Pending = 'pending',
    Paid = 'paid',
    Cancelled = 'cancelled'
}


export enum FieldCooperation {
    Land = 'land',       // Bất động sản (mua bán)
    Rental = 'rental',   // Cho thuê
}

export enum ContractStatus {
    Active = 'active',
    Ended = 'ended',
    Cancelled = 'cancelled',
}

export enum ProductStatus {
    New = 'new',
    Update = 'update',
    Pending = 'pending',
    Confirmed = 'confirmed',
    Cancelled = 'cancelled',
}


export enum RentalAmenity {
    FullFurnished = 'full_furnished',
    Mezzanine = 'mezzanine',
    KitchenShelf = 'kitchen_shelf',
    AirConditioner = 'air_conditioner',
    WashingMachine = 'washing_machine',
    Refrigerator = 'refrigerator',
    Elevator = 'elevator',
    NoLiveWithOwner = 'no_live_with_owner',
    FreeTime = 'free_time',
    Security247 = 'security_24_7',
    BasementParking = 'basement_parking',
}
