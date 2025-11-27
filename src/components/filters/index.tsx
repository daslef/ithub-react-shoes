import { Modal } from "@mantine/core"

import type { NavigateFn, SearchFilter } from "@tanstack/react-router"
import type { Product } from "../../types"
import PriceFilter from "./price-filter/price-filter"

type FiltersProps = {
    products: Product[],
    navigate: NavigateFn,
    opened: boolean,
    close: () => void,
    searchFilters: SearchFilter<any>
}

export default function Filters({ products, navigate, opened, close, searchFilters }: FiltersProps) {
    return (
        <Modal title="Filters" opened={opened} onClose={close} yOffset="10dvh">
            <PriceFilter discountOnly={searchFilters.discount_gte} products={products} navigate={navigate}/>
        </Modal>
    )
}