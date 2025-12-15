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
    User = 'user'
}

export enum CommissionStatus {
    Pending = 'pending',
    Paid = 'paid',
}

export enum FieldCooperation {
    Land = 'land',     // Bất động sản (mua bán)
    Rental = 'rental', // Cho thuê (phòng trọ, nhà thuê, CHDV)
}

export enum ContractStatus {
    ACTIVE = 'active',
    ENDED = 'ended',
    CANCELLED = 'cancelled',
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