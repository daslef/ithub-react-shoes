import type { CreateProduct, Product } from "../types";
import fetcher from "./fetcher";

type Filter = {
    field: string,
    value: string | number
}

type Filters = Filter[]

type Sorter = 'discount' | 'current_price' | '-current_price' | 'name'

function getAll(filters: Filters = [], sorter: Sorter = 'name') {
    console.log({ filters, sorter })
    return fetcher<Product[]>("products", filters, sorter)
}

export const productsApi = {
    getAll,
    create: (payload: CreateProduct) =>
        fetcher<Product>("products", [], null, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
}