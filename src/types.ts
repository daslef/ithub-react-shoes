export type Category = {
    id: number,
    category_name: string
}

export type Brand = {
    id: number,
    brand_name: string
}

export type Product = {
    id: number,
    name: string,
    current_price: number,
    raw_price: number,
    discount: number,
    likes_count: number,
    is_new: boolean,
    orders_count: number,
    sizes: number[],
    category_id: number,
    brand_id: number
}

export type CreateProduct = {
    name: string,
    current_price: number,
    raw_price: number,
    discount: number,
    likes_count: 0,
    is_new: true,
    orders_count: 0,
    sizes: number[],
    category_id: number,
    brand_id: number
}

export type Order = {
    id: number,
    firstName: string,
    lastName: string,
    delivery: "pickup" | "courier",
    productId: number,
    createdAt: number
}

export type CreateOrder = Omit<Order, 'id' | 'createdAt'>