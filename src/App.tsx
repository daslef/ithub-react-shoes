import { useState, useEffect } from "react";
import {
  MantineProvider,
  Text,
  Title,
  Card,
  Group,
  Badge,
  Container,
  Flex,
  Button,
  Image,
  SimpleGrid,
  AppShell,
  Burger,
  NavLink,
  Skeleton
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import { theme } from "./theme";

import { categoriesApi } from "./api/categories";
import { productsApi } from "./api/products";
import type { Category, Product } from "./types";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";

import "./App.css";

import reactLogo from "./assets/react.svg";
import defaultImage from "./assets/default-shoes.png";


function App() {
  const [opened, { toggle }] = useDisclosure();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null)

  const [isLoading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      categoriesApi.getAll(),
      productsApi.getAll()
    ]).then(([categoriesResponse, productsResponse]) => {
      if (categoriesResponse.status === "fulfilled") {
        setCategories(categoriesResponse.value)
      }
      if (productsResponse.status === "fulfilled") {
        setProducts(productsResponse.value)
      }
    }).catch(error => {
      setFetchError(error)
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <MantineProvider theme={theme}>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />

          <div>Logo</div>
        </AppShell.Header>

        <AppShell.Navbar>
          {categories === null && [1, 2, 3, 4, 5].map(index => <Skeleton height={35} mb={6} key={`category_skeleton_${index}`} />)}
          {categories?.map(category => <NavLink label={category.category_name} key={`category_${category.id}`} href="/" />)}
        </AppShell.Navbar>

        <AppShell.Main>
          <Flex justify="center">
            <Container className="posts" fluid>
              <h2>Markerplace Products</h2>

              {products === null && <p>No products found...</p>}

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                {products?.map((product) => {
                  return (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
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

                      <Button color="blue" fullWidth mt="md" radius="md">
                        Order Now!
                      </Button>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </Container>

            {fetchError && (
              <section className="error">{fetchError.message}</section>
            )}

            {isLoading && (
              <img src={reactLogo} className="logo spinner" alt="spinner" />
            )}
          </Flex>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
