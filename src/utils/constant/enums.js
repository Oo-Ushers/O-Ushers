export const roles = {
    CUSTOMER: "customer",
    ADMIN: "admin",
}
Object.freeze(roles)


export const status = {
    PENDING: "pending",
    VERIFIED: "verified",
    BLOCKED: "blocked"

}
Object.freeze(status)


export const CouponType = {
    FIXED: "fixed",
    PERCENTAGE: "percentage"
}
Object.freeze(CouponType)


export const orderStatus = {
    PLACED: "placed",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled"
}
Object.freeze(orderStatus)


export const payment = {
    CASH: "cash",
    VISA: "visa",
}
Object.freeze(payment)