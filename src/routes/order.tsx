import { createFileRoute } from '@tanstack/react-router'
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
import { TextInput, SegmentedControl, Checkbox, Button } from '@mantine/core'


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

type FormInputs = {
  firstName: string,
  lastName: string,
  delivery: "courier" | "pickup",
  acceptRules: boolean
}

function RouteComponent() {
  const { productId } = Route.useSearch()
  const {
    handleSubmit,
    formState,
    control
  } = useForm<FormInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      delivery: "courier",
      acceptRules: false
    }
  })

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data)
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

        <Button disabled={!formState.isValid} onClick={handleSubmit(onSubmit)}>Оформить</Button>
      </form>
    </>
  )
}
