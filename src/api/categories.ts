import { baseUrl } from "./config";
import type { Category } from "../types";

function getAll() {
    return new Promise<Category[]>((resolve, reject) => {
        return fetch(baseUrl + '/categories')
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

export const categoriesApi = {
    getAll
}