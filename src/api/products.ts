import { baseUrl } from "./config";
import type { Product } from "../types";

function getAll() {
    return new Promise<Product[]>((resolve, reject) => {
        return fetch(baseUrl + '/products')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error with status" + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export const productsApi = {
    getAll
}