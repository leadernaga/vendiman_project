export interface verify_otp {
    otp: string | number
}

export interface nodemailer_data_Type {
    otp: string | number
    username: string
    email: string
}

export interface jwtPayload {
    otp: string | number
    email: string
    role: string
}

export interface nodemailer_response {
    message: string
}

export interface place_order {
    item_ids: [string]
    inventory_id: string
    user_id: string
    order_id: string
}
