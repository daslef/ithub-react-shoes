import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'

import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { TextInput, Select, NumberInput, Button, Text, Group, Title } from '@mantine/core'

import useQuery from '../hooks/useQuery'
import useMutation from '../hooks/useMutation'

import { categoriesApi } from '../api/categories'
import { productsApi } from '../api/products'
import { brandsApi } from '../api/brands'

import type { CreateProduct } from '../types'

export const Route = createFileRoute('/create-product')({
  component: RouteComponent,
})

const formSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Name is required")),
  raw_price: v.pipe(v.number("Price must be set"), v.minValue(0.01, "Price must be at least 1 cent")),
  discount: v.fallback(
    v.pipe(v.number("Discount must be set"), v.minValue(0), v.maxValue(99)),
    0
  ),
  category_id: v.pipe(v.string("Category must be set"), v.transform(Number), v.finite(), v.integer(), v.minValue(1)),
  brand_id: v.pipe(v.string("Brand must be set"), v.transform(Number), v.finite(), v.integer(), v.minValue(1))
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath })

  const {
    handleSubmit,
    formState,
    control
  } = useForm({
    defaultValues: {
      name: ""
    },
    resolver: valibotResolver(formSchema),
    mode: "onTouched"
  })

  const mutation = useMutation({
    queryFunction: productsApi.create
  })

  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
    queryFunction: brandsApi.getAll,
    dependencies: []
  })

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryFunction: categoriesApi.getAll,
    dependencies: []
  })

  useEffect(() => {
    if (!mutation?.result) {
      return
    }

    navigate({ to: "/" })
  }, [mutation.result])

  const onSubmit: SubmitHandler<v.InferOutput<typeof formSchema>> = (data) => {
    const payload = {
      ...data,
      likes_count: 0,
      is_new: true,
      orders_count: 0,
      sizes: [35, 36, 37],
      current_price: data.raw_price * (1 - data.discount / 100),
      brand_id: data.brand_id,
      category_id: data.category_id
    } satisfies CreateProduct;

    console.log(payload)
    mutation.mutate(payload)
  }

  return (
    <>
      <Title order={2}>Create new Product</Title>

      <form style={{ display: "flex", flexDirection: "column", gap: 10, width: "min(720px, 100%)" }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => {
            if (fieldState.invalid) {
              return <TextInput label="Title" placeholder="Nike AirMax" error={formState.errors.name?.message} {...field} />
            }

            return <TextInput label="Title" placeholder="Nike AirMax" {...field} />
          }}
        />

        <Group>
          <Controller
            name="raw_price"
            control={control}
            render={({ field, fieldState }) => {
              if (fieldState.invalid) {
                return <NumberInput style={{ flex: 1 }} description="Before discount" decimalScale={2} allowNegative={false} label="Raw Price" placeholder="1000.00" error={formState.errors.raw_price?.message} {...field} />
              }

              return <NumberInput style={{ flex: 1 }} description="Before discount" decimalScale={2} allowNegative={false} label="Raw Price" placeholder="1000.00" {...field} />
            }}
          />

          <Controller
            name="discount"
            control={control}
            render={({ field, fieldState }) => {
              if (fieldState.invalid) {
                return <NumberInput suffix="%" min={0} max={99} description="In percents" allowDecimal={false} label="Discount" placeholder="15" error={formState.errors.discount?.message} {...field} />
              }

              return <NumberInput suffix="%" min={0} max={99} description="In percents" allowDecimal={false} label="Discount" placeholder="15" {...field} />
            }}
          />
        </Group>
        <Controller
          name="brand_id"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <>
                <Select
                  label="Brand"
                  placeholder="Pick value"
                  data={brandsData?.map(brand => ({
                    value: String(brand.id),
                    label: brand.brand_name
                  })) || []}
                  comboboxProps={{
                    transitionProps: { transition: 'pop', duration: 100 }
                  }}
                  searchable
                  {...field}
                />
                {fieldState.invalid && <Text size="xs" c="red">{formState.errors.brand_id?.message}</Text>}
              </>
            )
          }}
        />

        <Controller
          name="category_id"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <>
                <Select
                  label="Category"
                  placeholder="Pick value"
                  data={categoriesData?.map(category => ({
                    value: String(category.id),
                    label: category.category_name
                  })) || []}
                  comboboxProps={{
                    transitionProps: { transition: 'pop', duration: 100 }
                  }}
                  searchable
                  {...field}
                />
                {fieldState.invalid && <Text size="xs" c="red">{formState.errors.category_id?.message}</Text>}
              </>
            )
          }}
        />

        <Button disabled={!formState.isValid || mutation.isLoading} onClick={handleSubmit(onSubmit)}>Оформить</Button>
      </form>
    </>
  )
}
