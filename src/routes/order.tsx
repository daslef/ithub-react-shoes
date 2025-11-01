import { createFileRoute } from '@tanstack/react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'

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
  lastName: string
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
      lastName: ""  
    }
  })

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data)
  }

  return (
    <>
      <div>Order for Product {productId}</div>

      <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <input placeholder='Имя' {...register("firstName", { required: true })} />
        {formState.errors.firstName && <span>Поле неверно заполнено</span>}

        <input placeholder='Фамилия' {...register("lastName", { required: true })} />
        {formState.errors.lastName && <span>Поле неверно заполнено</span>}

        <button type="submit">Оформить</button>
      </form>
    </>
  )
}
