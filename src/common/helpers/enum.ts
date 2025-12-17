export enum Order {
    ASC = "ASC",
    DESC = "DESC",
}

export enum RentalType {
    BoardingHouse = 'boarding_house', // dãy trọ
    WholeHouse = 'whole_house',       // nhà nguyên căn
    ServicedApartment = 'serviced_apartment', // CHDV
    Apartment = 'apartment',          // chung cư
}

export enum RentalStatus {
    NEW = 'NEW',           // Nhà mới được tạo, chưa xác nhận
    CONFIRMED = 'CONFIRMED', // Nhà đã được admin xác nhận
    UPDATE = 'UPDATE',     // Nhà đã được chỉnh sửa sau khi tạo
    CANCELLED = 'CANCELLED' // Nhà đã bị huỷ hoặc xoá
}


export enum RoomStatus {
    Available = 'available',   // Trống
    Rented = 'rented',         // Đã thuê
    Deposited = 'deposited',   // Đã cọc
    Maintenance = 'maintenance' // Bảo trì
}

export enum UserRole {
    Admin = 'admin_saigon',
    Sale = 'sale_saigon',
    Owner = 'owner',    // chủ nhà
    Broker = 'broker',  // môi giới
    Tenant = 'tenant'
}

export enum BookingStatus {
    PENDING = 'pending',     // đã đặt lịch
    CONFIRMED = 'confirmed', // xác nhận với chủ trọ
    COMPLETED = 'completed', // đã đi xem
    CANCELLED = 'cancelled', // khách huỷ
    NO_SHOW = 'no_show',     // khách không đến
}

export enum CommissionStatus {
    Pending = 'pending',
    Paid = 'paid',
}

export enum FieldCooperation {
    Land = 'land',     // Bất động sản (mua bán)
    Rental = 'rental', // Cho thuê (phòng trọ, nhà thuê, CHDV)
}

export enum CollaboratorType {
    OWNER = 'owner',    // Chủ nhà
    BROKER = 'broker',        // Môi giới
}

export enum CustomerType {
    OWNER = 'owner',   // Chủ nhà
    BROKER = 'broker',       // Môi giới
    TENANT = 'tenant',       // Khách thuê / khách hàng
}

export enum ContractStatus {
    ACTIVE = 'active',
    ENDED = 'ended',
    CANCELLED = 'cancelled',
}

export enum CommissionType {
    FIXED = 'fixed',        // Số tiền cố định
    PERCENT = 'percent',    // % tiền thuê
}


export enum ProductStatus {
    NEW = 'new',
    UPDATE = 'update',
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled'
}

export enum ProductStatusOptions {
    new = 'Tin mới',
    update = 'Có chỉnh sửa',
    pending = 'Cần cập nhật',
    confirmed = 'Đã xác nhận',
    cancelled = 'Đã hủy'
}

export enum RentalAmenity {
    FULL_FURNISHED = 'full_furnished',
    MEZZANINE = 'mezzanine',
    KITCHEN_SHELF = 'kitchen_shelf',
    AIR_CONDITIONER = 'air_conditioner',
    WASHING_MACHINE = 'washing_machine',
    REFRIGERATOR = 'refrigerator',
    ELEVATOR = 'elevator',
    NO_LIVE_WITH_OWNER = 'no_live_with_owner',
    FREE_TIME = 'free_time',
    SECURITY_24_7 = 'security_24_7',
    BASEMENT_PARKING = 'basement_parking',
}
