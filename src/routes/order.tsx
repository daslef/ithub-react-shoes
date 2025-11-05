import { createFileRoute } from '@tanstack/react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { TextInput, SegmentedControl } from '@mantine/core'


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
    register,
    handleSubmit,
    formState
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
  // const validateDoubleA = (name: string) => name.match(/а{2,}/gi) !== null ? true : false

  return (
    <>
      <div>Order for Product {productId}</div>

      <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Имя" placeholder="Иван" />
        
        {/* <input placeholder='Имя' {...register("firstName", nameValidation)} />
        {formState.errors.firstName && <span>Поле неверно заполнено</span>} */}

        <TextInput label="Фамилия" placeholder="Иванов" />

        {/* <input placeholder='Фамилия' {...register("lastName", nameValidation)} />
        {formState.errors.lastName && <span>Поле неверно заполнено</span>} */}

        <label htmlFor="delivery">Тип доставки</label>
        <SegmentedControl data={[
          { label: "Курьер", value: "courier"},
          { label: "Самовывоз", value: "pickup"}
        ]} />
        
        {/* <select id="delivery" {...register("delivery", { required: true })}>
          <option value="courier">Курьер</option>
          <option value="pickup">Самовывоз</option>
        </select> */}

        <input type="checkbox" id="acceptRules" {...register("acceptRules", { required: true })} />
        <label htmlFor="acceptRules">Согласен с <a>правилами доставки</a></label>

        <button type="submit" disabled={!formState.isValid}>Оформить</button>
      </form>
    </>
  )
}
