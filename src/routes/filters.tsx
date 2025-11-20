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
  NumberInput,
  RangeSlider,
  Title,
  Switch
} from "@mantine/core";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from 'valibot'

import { productsApi } from "../api/products";
import type { Product } from "../types";
import useQuery from "../hooks/useQuery";

import reactLogo from "../assets/react.svg";
import defaultImage from "../assets/default-shoes.png";

import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/filters')({
  component: Index,
})

const priceFormSchema = v.object({
  minPrice: v.pipe(v.number(), v.integer(), v.minValue(0)),
  maxPrice: v.pipe(v.number(), v.integer(), v.minValue(1)),
  discountOnly: v.boolean()
})

function Index() {
  const {
    isLoading: isLoadingProducts,
    data: products,
    error: errorProducts,
  } = useQuery<Product[]>({
    queryFunction: productsApi.getAll,
    dependencies: []
  });

  const { handleSubmit, control, formState } = useForm({
    defaultValues: {
      minPrice: 0,
      maxPrice: 10000,
      discountOnly: false
    },
    resolver: valibotResolver(priceFormSchema)
  })

  const navigate = useNavigate({ from: Route.fullPath })
  const isLoading = isLoadingProducts;
  const error = errorProducts;

  const onPriceFilter = (payload: v.InferOutput<typeof priceFormSchema>) => {
    console.log(payload)

    const searchParams = {
      "current_price_gte": payload.minPrice,
      "current_price_lte": payload.maxPrice,
      "discount_ne": 0
    }

    if (!payload.discountOnly) {
      // @ts-ignore
      delete searchParams["discount_ne"]
    }

    navigate({ 
      search: () => searchParams
    })
  }

  return (
    <Flex justify="center">
      <Container className="posts" fluid>
        <h2>Markerplace Products</h2>

        <form onSubmit={handleSubmit(onPriceFilter)}>
          <Flex
            direction="column"
            maw="50%"
            gap={24}
            p={12}
            mb={48}
            style={{ boxShadow: "0 0 2px 1px gray" }}
          >
            <Title order={4}>Filter by price</Title>

            <RangeSlider defaultValue={[
              formState.defaultValues?.minPrice ?? 0,
              formState.defaultValues?.maxPrice ?? 10000
            ]} />

            <Flex gap={8}>
              <Controller
                name="minPrice"
                control={control}
                render={({ field }) => {
                  return <NumberInput allowDecimal={false} min={0} {...field} />
                }}
              />
              <Controller
                name="maxPrice"
                control={control}
                render={({ field }) => {
                  return <NumberInput allowDecimal={false} min={0} {...field} />
                }}
              />
            </Flex>
            <Controller
                name="discountOnly"
                control={control}
                render={({ field }) => {
                  return <Switch label="Only with discount" {...field} value={String(field.value)} />
                }}
              />
            <Button onClick={handleSubmit(onPriceFilter)}>Apply</Button>
          </Flex>
        </form>

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