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