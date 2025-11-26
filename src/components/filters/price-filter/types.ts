import * as v from 'valibot'
import { type NavigateFn } from '@tanstack/react-router'
import type { Product } from '../../../types'

export type PriceFilterProps = {
    navigate: NavigateFn,
    products: Product[]
}

export const priceFormSchema = v.object({
  minPrice: v.pipe(v.number(), v.transform(value => Math.floor(value)), v.integer(), v.minValue(0)),
  maxPrice: v.pipe(v.number(), v.transform(value => Math.ceil(value)), v.integer(), v.minValue(1)),
  discountOnly: v.boolean()
})
