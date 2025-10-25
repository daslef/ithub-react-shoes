import { baseUrl } from "./config";

type Resource = "categories" | "products" | "brands"

export default function fetcher<R>(resource: Resource) {
    return new Promise<R>((resolve, reject) => {
        return fetch(baseUrl + '/' + resource)
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