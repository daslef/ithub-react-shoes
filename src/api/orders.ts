import type { Order } from "../types";
import fetcher from "./fetcher";

export const ordersApi = {
    getAll: () => fetcher<Order[]>("orders")
}