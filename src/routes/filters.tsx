import { Container, Flex, SimpleGrid } from "@mantine/core";

import ProductCard from "../components/product/product";
import { productsApi } from "../api/products";
import type { Product } from "../types";
import useQuery from "../hooks/useQuery";

import PriceFilter from "../components/filters/price-filter/price-filter";

import reactLogo from "../assets/react.svg";

import { createFileRoute, useNavigate } from "@tanstack/react-router";

type SearchFilters = {
  current_price_gte: number | undefined;
  current_price_lte: number | undefined;
};

export const Route = createFileRoute("/filters")({
  component: Index,
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

function Index() {
  const searchFilters = Route.useSearch();

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
        }, [])
      ),
    dependencies: [
      searchFilters.current_price_gte,
      searchFilters.current_price_lte,
    ],
  });

  const navigate = useNavigate({ from: Route.fullPath });
  const isLoading = isLoadingProducts;
  const error = errorProducts;

  return (
    <Flex justify="center">
      <Container className="posts" fluid>
        <h2>Markerplace Products</h2>

        <PriceFilter navigate={navigate} products={products ?? []} />
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
