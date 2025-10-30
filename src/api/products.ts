import type { Product } from "../types";
import fetcher from "./fetcher";

type Filter = {
    field: string,
    value: string | number
}

type Filters = Filter[]


function getAll(filters: Filters = []) {
    return fetcher<Product[]>("products", filters)
}

export const productsApi = {
    getAll
}