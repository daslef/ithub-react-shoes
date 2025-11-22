import {
    Flex,
    Button,
    NumberInput,
    RangeSlider,
    Title,
    Switch
} from "@mantine/core";

import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from 'valibot'

import { priceFormSchema, type PriceFilterProps } from "./types";



export default function PriceFilter({ navigate } : PriceFilterProps) {
    const { handleSubmit, control, formState } = useForm({
        defaultValues: {
            discountOnly: false
        },
        resolver: valibotResolver(priceFormSchema)
    })

    const onPriceFilter = (payload: v.InferOutput<typeof priceFormSchema>) => {
        console.log(payload)

        const searchParams = {
            "current_price_gte": payload.minPrice,
            "current_price_lte": payload.maxPrice,
            "discount_ne": 0
        }

        if (!payload.discountOnly) {
            // @ts-ignore
            delete searchParams["discount_ne"]
        }

        navigate({
            search: () => searchParams
        })
    }

    return (
        <form onSubmit={handleSubmit(onPriceFilter)}>
            <Flex
                direction="column"
                maw="50%"
                gap={24}
                p={12}
                mb={48}
                style={{ boxShadow: "0 0 2px 1px gray" }}
            >
                <Title order={4}>Filter by price</Title>

                <RangeSlider defaultValue={[
                    0,
                    10000
                ]} />

                <Flex gap={8}>
                    <Controller
                        name="minPrice"
                        control={control}
                        render={({ field }) => {
                            return <NumberInput allowDecimal={false} min={0} {...field} />
                        }}
                    />
                    <Controller
                        name="maxPrice"
                        control={control}
                        render={({ field }) => {
                            return <NumberInput allowDecimal={false} min={0} {...field} />
                        }}
                    />
                </Flex>
                <Controller
                    name="discountOnly"
                    control={control}
                    render={({ field }) => {
                        return <Switch label="Only with discount" {...field} value={String(field.value)} />
                    }}
                />
                <Button onClick={handleSubmit(onPriceFilter)}>Apply</Button>
            </Flex>
        </form>
    )
}