import type { Product } from "../types";
import fetcher from "./fetcher";

function getAll() {
    return fetcher<Product[]>("products")
}

export const productsApi = {
    getAll
}