import type { Brand } from "../types";
import fetcher from "./fetcher";

function getAll() {
    return fetcher<Brand[]>("brands")
}

export const brandsApi = {
    getAll
}