import { createFileRoute } from '@tanstack/react-router'

type ProductOrderSchema = {
  productId: number
}

export const Route = createFileRoute('/order')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ProductOrderSchema => {
    
  }
})

function RouteComponent() {
  const { productId } = Route.useSearch()
  return <div>Order for Product {productId}</div>
}
