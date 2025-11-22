import * as v from 'valibot'
import { type NavigateFn } from '@tanstack/react-router'

export type PriceFilterProps = {
    navigate: NavigateFn
}

export const priceFormSchema = v.object({
  minPrice: v.pipe(v.number(), v.integer(), v.minValue(0)),
  maxPrice: v.pipe(v.number(), v.integer(), v.minValue(1)),
  discountOnly: v.boolean()
})
