import type { Order } from "../types";
import fetcher from "./fetcher";

function getAll() {
    return fetcher<Order[]>("orders")
}

export const ordersApi = {
    getAll
}