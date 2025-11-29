import { Container, Flex, SimpleGrid, Button, Select, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import ProductCard from "../components/product/product";
import { productsApi } from "../api/products";
import type { Product } from "../types";
import useQuery from "../hooks/useQuery";

import Filters from "../components/filters";

import reactLogo from "../assets/react.svg";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type SearchFilters = {
  current_price_gte: number | undefined;
  current_price_lte: number | undefined;
  discount_gte: number | undefined;
};

type SearchSorter = {
  _sort: '-discount' | 'current_price' | '-current_price' | 'name' | undefined
}

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: Record<string, unknown>): SearchFilters & SearchSorter => {
    return {
      current_price_gte: search.current_price_gte
        ? Number(search.current_price_gte)
        : undefined,
      current_price_lte: search.current_price_lte
        ? Number(search.current_price_lte)
        : undefined,
      discount_gte: search.discount_gte
        ? Number(search.discount_gte)
        : undefined,
      _sort: search._sort as SearchSorter["_sort"]
    };
  },
});

function Index() {
  function updateSorter(newSorter: string | null) {
    if (newSorter) {
      setSorter(newSorter)
      navigate({ search: { ...searchFilters, '_sort': newSorter as SearchSorter["_sort"] } })
    }
  }

  const { _sort: searchSorter, ...searchFilters } = Route.useSearch();
  const [opened, { open, close }] = useDisclosure(false)

  const [sorter, setSorter] = useState<string | null>(searchSorter || "name")

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
        }, []),
        sorter
      ),
    dependencies: [
      searchFilters.current_price_gte,
      searchFilters.current_price_lte,
      searchFilters.discount_gte,
      sorter
    ],
  });

  const navigate = useNavigate({ from: Route.fullPath });
  const isLoading = isLoadingProducts;
  const error = errorProducts;

  return (
    <Flex justify="center">
      <Container className="posts" fluid>
        <h2>Markerplace Products</h2>

        <Group mb={16}>
          <Button onClick={open}>Filters</Button>
          <Filters searchFilters={searchFilters} opened={opened} close={close} navigate={navigate} products={products ?? []} />
          <Select data={['-discount', 'current_price', '-current_price', 'name']} value={sorter} allowDeselect={false} onChange={updateSorter} />
        </Group>

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
