import { Container, Flex, SimpleGrid, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import ProductCard from "../components/product/product";
import Filters from "../components/filters";

import { productsApi } from "../api/products";
import type { Product } from "../types";
import useQuery from "../hooks/useQuery";

import reactLogo from "../assets/react.svg";

type SearchFilters = {
  current_price_gte: number | undefined;
  current_price_lte: number | undefined;
};

export const Route = createFileRoute("/category/$categoryId")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchFilters => {
    return {
      current_price_gte: search.current_price_gte
        ? Number(search.current_price_gte)
        : undefined,
      current_price_lte: search.current_price_lte
        ? Number(search.current_price_lte)
        : undefined,
    };
  },
});

function RouteComponent() {
  const searchFilters = Route.useSearch();
  const { categoryId } = Route.useParams();
  const [opened, { open, close }] = useDisclosure(false)
  const navigate = useNavigate({ from: Route.fullPath });

  const {
    isLoading: isLoadingProducts,
    data: products,
    error: errorProducts,
  } = useQuery<Product[]>({
    queryFunction: () =>
      productsApi.getAll(
        Object.entries(searchFilters).reduce((filters, [field, value]) => {
          if (value === undefined) {
            return filters;
          }
          return [...filters, { field, value }];
        }, [{ field: "category_id", value: categoryId }])
      ),
    dependencies: [categoryId, searchFilters.current_price_gte, searchFilters.current_price_lte,],
  });

  const isLoading = isLoadingProducts;
  const error = errorProducts;

  return (
    <Flex justify="center">
      <Container className="posts" fluid>
        <h2>Markerplace Products</h2>

        <Button onClick={open}>Filters</Button>
        <Filters opened={opened} close={close} navigate={navigate} products={products ?? []} />

        {products === null && <p>No products found...</p>}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {products?.map((product) => (
            <ProductCard product={product} navigate={navigate} />
          ))}
        </SimpleGrid>
      </Container>

      {error && <section className="error">{error.message}</section>}

      {isLoading && (
        <img src={reactLogo} className="logo spinner" alt="spinner" />
      )}
    </Flex>
  );
}
