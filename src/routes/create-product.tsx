import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
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

type FormInputs = Pick<CreateProduct, 'name' | 'raw_price' | 'discount'> & {
  category_id: string,
  brand_id: string
}

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath })

  const {
    handleSubmit,
    formState,
    control
  } = useForm<FormInputs>({
    defaultValues: {
      name: ""
    },
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

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const payload = {
      ...data,
      likes_count: 0,
      is_new: true,
      orders_count: 0,
      sizes: [35, 36, 37],
      current_price: data.raw_price * (1 - data.discount / 100),
      brand_id: Number(data.brand_id),
      category_id: Number(data.category_id)
    } satisfies CreateProduct;

    console.log(payload)
    mutation.mutate(payload)
  }

  const nameValidation = { required: true, pattern: /^[a-z]+ [a-z]+.*$/i }
  const priceValidation = { required: true, pattern: /^\d+(\.\d\d)?$/ }
  const discountValidation = { required: true, pattern: /^\d{1,2}$/ }

  return (
    <>
      <Title order={2}>Create new Product</Title>

      <form style={{ display: "flex", flexDirection: "column", gap: 10, width: "min(720px, 100%)" }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ ...nameValidation }}
          render={({ field, fieldState }) => {
            if (fieldState.invalid) {
              return <TextInput label="Title" placeholder="Nike AirMax" error="Incorrect format" {...field} />
            }

            return <TextInput label="Title" placeholder="Nike AirMax" {...field} />
          }}
        />

        <Group>
          <Controller
            name="raw_price"
            control={control}
            rules={priceValidation}
            render={({ field, fieldState }) => {
              if (fieldState.invalid) {
                return <NumberInput style={{ flex: 1 }} description="Before discount" decimalScale={2} allowNegative={false} label="Raw Price" placeholder="1000.00" error="Incorrect format" {...field} />
              }

              return <NumberInput style={{ flex: 1 }} description="Before discount" decimalScale={2} allowNegative={false} label="Raw Price" placeholder="1000.00" {...field} />
            }}
          />

          <Controller
            name="discount"
            control={control}
            rules={discountValidation}
            render={({ field, fieldState }) => {
              if (fieldState.invalid) {
                return <NumberInput suffix="%" min={0} max={99} description="In percents" allowDecimal={false} label="Discount" placeholder="15" error="Incorrect format" {...field} />
              }

              return <NumberInput suffix="%" min={0} max={99} description="In percents" allowDecimal={false} label="Discount" placeholder="15" {...field} />
            }}
          />
        </Group>
        <Controller
          name="brand_id"
          control={control}
          rules={{ required: true }}
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
                {fieldState.invalid && <Text size="xs" c="red">Brand must be selected!</Text>}
              </>
            )
          }}
        />

        <Controller
          name="category_id"
          control={control}
          rules={{ required: true }}
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
                {fieldState.invalid && <Text size="xs" c="red">Category must be selected!</Text>}
              </>
            )
          }}
        />

        <Button disabled={!formState.isValid || mutation.isLoading} onClick={handleSubmit(onSubmit)}>Оформить</Button>
      </form>
    </>
  )
}
