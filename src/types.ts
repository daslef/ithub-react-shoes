import * as v from 'valibot'
import * as schema from './schema'

export type Category = {
    id: number,
    category_name: string
}

export type Brand = {
    id: number,
    brand_name: string
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

export type Product = v.InferOutput<typeof schema.productSchema>
export type CreateProduct = v.InferOutput<typeof schema.createProductSchema>

// вывести типы Order и CreateOrder из схем
// (удалив типы, указанные здесь сейчас)