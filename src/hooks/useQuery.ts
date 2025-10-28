import { useState, useEffect } from "react";

type UseQuery<T> = {
    queryFunction: () => Promise<T>
}

export default function useQuery<T>({
    queryFunction
} : UseQuery<T>) {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        setLoading(true)

        queryFunction()
            .then(responseData => {
                setData(responseData)
            })
            .catch((error: unknown) => {
                setError(error as Error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return { data, isLoading, error }
}