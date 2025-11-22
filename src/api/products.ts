import type { CreateProduct, Product } from "../types";
import fetcher from "./fetcher";

type Filter = {
    field: string,
    value: string | number
}

type Filters = Filter[]


function getAll(filters: Filters = []) {
    console.log(filters)
    return fetcher<Product[]>("products", filters)
}

export const productsApi = {
    getAll,
    create: (payload: CreateProduct) =>
        fetcher<Product>("products", [], {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
}