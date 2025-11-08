import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
import { TextInput, SegmentedControl, Checkbox, Button } from '@mantine/core'

import useMutation from '../hooks/useMutation'
import { ordersApi } from '../api/orders'
import type { CreateOrder, Order } from '../types'

type ProductOrderSchema = {
  productId: number
}

export const Route = createFileRoute('/order')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ProductOrderSchema => {
    return {
      productId: Number(search.productId)
    }
  }
})

type FormInputs = CreateOrder & {
  acceptRules: boolean
}

function RouteComponent() {
  const { productId } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const {
    handleSubmit,
    formState,
    control
  } = useForm<FormInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      delivery: "courier",
      acceptRules: false,
      productId
    }
  })

  const mutation = useMutation({
    queryFunction: ordersApi.create
  })

  useEffect(() => {
    if (!mutation?.result) {
      return
    }

    navigate({ to: "/" })
  }, [mutation.result])

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const { acceptRules, ...payload } = data

    console.log(payload)
    mutation.mutate(payload)
  }

  const nameValidation = { required: true, minLength: 2, pattern: /^[А-Я][а-я]+/ }

  return (
    <>
      <div>Order for Product {productId}</div>

      <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="firstName"
          control={control}
          rules={{ ...nameValidation }}
          render={({ field, fieldState }) => {
            if (fieldState.invalid) {
              return <TextInput label="Имя" placeholder="Иван" error="Поле заполнено некорректно" {...field} />
            }

            return <TextInput label="Имя" placeholder="Иван" {...field} />
          }}
        />

        <Controller
          name="lastName"
          control={control}
          rules={{ ...nameValidation }}
          render={({ field, fieldState }) => {
            if (fieldState.invalid) {
              return <TextInput label="Фамилия" placeholder="Иванов" error="Поле заполнено некорректно" {...field} />
            }

            return <TextInput label="Фамилия" placeholder="Иванов" {...field} />
          }}
        />

        <Controller
          name="delivery"
          control={control}
          render={({ field }) => {
            return (
              <>
                <label htmlFor="delivery">Тип доставки</label>
                <SegmentedControl {...field} data={[
                  { label: "Курьер", value: "courier" },
                  { label: "Самовывоз", value: "pickup" }
                ]} />
              </>
            )
          }}
        />

        <Controller 
          name="acceptRules"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return <Checkbox label="Согласен с правилами доставки" {...field} value={String(field.value)} />
          }}
        />

        <Button disabled={!formState.isValid || mutation.isLoading} onClick={handleSubmit(onSubmit)}>Оформить</Button>
      </form>
    </>
  )
}
