import type { Product } from "../../../types";

export function getLimits(products: Product[]) {
    const prices = products?.map(product => product.current_price) ?? []

    return {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
    }
}