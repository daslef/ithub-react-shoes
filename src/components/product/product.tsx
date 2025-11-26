import { Text, Card, Group, Badge, Button, Image } from "@mantine/core";
import type { NavigateFn } from "@tanstack/react-router";

import defaultImage from "../../assets/default-shoes.png";
import type { Product } from "../../types";

type ProductProps = {
  product: Product;
  navigate: NavigateFn;
};

export default function Product({ product, navigate }: ProductProps) {
  return (
    <Card
      key={`product_${product.id}`}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
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

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          navigate({ to: "/order", search: () => ({ productId: product.id }) });
        }}
      >
        Order Now!
      </Button>
    </Card>
  );
}
