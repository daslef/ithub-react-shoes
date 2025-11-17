import * as v from 'valibot'

const idSchema = v.union([
    v.pipe(v.string(), v.transform(Number), v.finite(), v.integer(), v.minValue(1)),
    v.pipe(v.number(), v.integer(), v.minValue(1))
]) 

const priceSchema = v.pipe(v.number(), v.minValue(0.01))
const quantitySchema = v.pipe(v.number(), v.integer(), v.minValue(0))

export const productSchema = v.object({
    id: idSchema,
    category_id: idSchema, 
    brand_id: idSchema,
    raw_price: priceSchema,
    current_price: priceSchema,
    name: v.pipe(v.string(), v.nonEmpty()),
    discount: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(99)),
    likes_count: quantitySchema,
    orders_count: quantitySchema,
    is_new: v.boolean(),
    sizes: v.array(idSchema)
})

export const createProductSchema = v.omit(
    v.object({
        ...productSchema.entries,
        likes_count: v.fallback(v.literal(0), 0),
        orders_count: v.fallback(v.literal(0), 0),
        is_new: v.fallback(v.literal(true), true)
    }),
    ['id']
)


// добавить схемы: 
// - orderSchema (на основе типа Order из файла types.ts)
// - createOrderSchema (на основе типа CreateOrder из файла types.ts)  

