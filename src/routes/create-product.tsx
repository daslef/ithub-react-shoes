import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
import { TextInput, SegmentedControl, NumberInput, Button } from '@mantine/core'

import useMutation from '../hooks/useMutation'
import { productsApi } from '../api/products'
import type { CreateProduct } from '../types'

export const Route = createFileRoute('/create-product')({
  component: RouteComponent,
})

type FormInputs = Omit<CreateProduct, 'likes_count' | 'is_new' | 'orders_count' | 'sizes' | 'current_price'>

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath })

  const {
    handleSubmit,
    formState,
    control
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      category_id: 1,
      brand_id: 1,
    }
  })

  const mutation = useMutation({
    queryFunction: productsApi.create
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
      current_price: data.raw_price * (1 - data.discount / 100)
    } satisfies CreateProduct;

    console.log(payload)
    mutation.mutate(payload)
  }

  const nameValidation = { required: true, pattern: /^[a-z]+ [a-z]+.*$/i }
  const priceValidation = { required: true, pattern: /^\d+(\.\d\d)?$/ }
  const discountValidation = { required: true, pattern: /^\d{1,2}$/ }

  return (
    <>
      <div>Create new Product</div>

      <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleSubmit(onSubmit)}>
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

        <Controller
          name="raw_price"
          control={control}
          rules={priceValidation}
          render={({ field, fieldState }) => {
            if (fieldState.invalid) {
              return <NumberInput description="Before discount" decimalScale={2} allowNegative={false} label="Raw Price" placeholder="1000.00" error="Incorrect format" {...field} />
            }

            return <NumberInput description="Before discount" decimalScale={2} allowNegative={false} label="Raw Price" placeholder="1000.00" {...field} />
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

            return <NumberInput suffix="%" min={0} max={99} description="In percents"  allowDecimal={false} label="Discount" placeholder="15" {...field} />
          }}
        />

        <Button disabled={!formState.isValid || mutation.isLoading} onClick={handleSubmit(onSubmit)}>Оформить</Button>
      </form>
    </>
  )
}
