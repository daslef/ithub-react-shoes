import { useState, useEffect } from "react";
import {
  createTheme,
  MantineProvider,
  Paper,
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

import { categoriesApi } from "./api/categories";
import type { Category } from "./types";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";

import "./App.css";

import reactLogo from "./assets/react.svg";
import defaultImage from "./assets/default-shoes.png";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type PostsState = Post[] | null;

type FetchErrorState = Error | null;

const theme = createTheme({
  fontFamily: "Montserrat",
  shadows: {
    md: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  },
  components: {
    Paper: Paper.extend({
      styles: {
        root: { backgroundColor: "#fff", boxShadow: "var(--paper-shadow)" },
      },
    }),
  },
});

function App() {
  const [opened, { toggle }] = useDisclosure();

  const [posts, setPosts] = useState<PostsState>(null);
  const [categories, setCategories] = useState<Category[] | null>(null)

  const [isLoading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<FetchErrorState>(null);

  useEffect(() => {
    setLoading(true);

    categoriesApi
      .getAll()
      .then(data => {
        setCategories(data)
      })
      .catch((error) => {
        setFetchError(error);
      })
      .finally(() => {
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
          {categories === null && [1,2,3,4,5].map(index => <Skeleton height={35} mb={6} key={`category_skeleton_${index}`} />)}
          {categories?.map(category => <NavLink label={category.category_name} key={`category_${category.id}`} href="/" />)}
        </AppShell.Navbar>

        <AppShell.Main>
          <Flex justify="center">
            <Container className="posts" fluid>
              <h2>Markerplace Products</h2>

              {posts === null && <p>No posts found...</p>}

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                {posts?.slice(0, 5).map((post) => {
                  return (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Image src={defaultImage} alt="Shoes image" />
                      </Card.Section>

                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{post.title}</Text>
                        <Badge color="pink">{post.id}</Badge>
                      </Group>

                      <Text size="sm" c="dimmed">
                        {post.body}
                      </Text>

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
