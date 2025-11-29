import type { Order, CreateOrder } from "../types";
import fetcher from "./fetcher";

export const ordersApi = {
    getAll: () => fetcher<Order[]>("orders"),
    create: (payload: CreateOrder) => 
        fetcher<Order>("orders", [], null, { 
            method: "POST", 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload)
        })
}