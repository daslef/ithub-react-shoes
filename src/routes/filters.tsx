import {
  Text,
  Card,
  Group,
  Badge,
  Container,
  Flex,
  Button,
  Image,
  SimpleGrid,
} from "@mantine/core";

import { productsApi } from "../api/products";
import type { Product } from "../types";
import useQuery from "../hooks/useQuery";

import PriceFilter from "../components/filters/price-filter/price-filter";

import reactLogo from "../assets/react.svg";
import defaultImage from "../assets/default-shoes.png";

import { createFileRoute, useNavigate } from '@tanstack/react-router'

type SearchFilters = {
  current_price_gte: number | undefined,
  current_price_lte: number | undefined
}

export const Route = createFileRoute('/filters')({
  component: Index,
  validateSearch: (search: Record<string, unknown>): SearchFilters => {
    return {
      current_price_gte: search.current_price_gte ? Number(search.current_price_gte) : undefined,
      current_price_lte: search.current_price_lte ? Number(search.current_price_lte) : undefined
    }
  }
})


function Index() {
  const searchFilters = Route.useSearch()

  const {
    isLoading: isLoadingProducts,
    data: products,
    error: errorProducts,
  } = useQuery<Product[]>({
    queryFunction: () => productsApi.getAll(
      Object.entries(searchFilters).reduce((filters, [field, value]) => {
        if (value === undefined) {
          return filters
        }
        return [...filters, { field, value }]
      }, [])
    ),
    dependencies: [searchFilters.current_price_gte, searchFilters.current_price_lte]
  });


  const navigate = useNavigate({ from: Route.fullPath })
  const isLoading = isLoadingProducts;
  const error = errorProducts;

  return (
    <Flex justify="center">
      <Container className="posts" fluid>
        <h2>Markerplace Products</h2>

        <PriceFilter navigate={navigate}/>
        {products === null && <p>No products found...</p>}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {products?.map((product) => {
            return (
              <Card key={`product_${product.id}`} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image src={defaultImage} alt="Shoes image" />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{product.name}</Text>
                  <Badge color="pink">{product.category_id}</Badge>
                </Group>

                <Group mt="auto" mb="xs" align="baseline">
                  <Text size="xs" c="dimmed">
                    {product.raw_price}
                  </Text>
                  <Text size="lg" c="violet" fw={600}>
                    {product.current_price}
                  </Text>
                </Group>

                <Button color="blue" fullWidth mt="md" radius="md" onClick={
                  () => {
                    navigate({ to: "/order", search: () => ({ productId: product.id }) })
                  }
                }>
                  Order Now!
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>

      {error && <section className="error">{error.message}</section>}

      {isLoading && (
        <img src={reactLogo} className="logo spinner" alt="spinner" />
      )}
    </Flex>
  );
}