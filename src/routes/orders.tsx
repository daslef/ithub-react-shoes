import { createFileRoute } from "@tanstack/react-router";
import { Table, Title } from "@mantine/core";
import useQuery from "../hooks/useQuery";
import { ordersApi } from "../api/orders";

export const Route = createFileRoute("/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useQuery({
    queryFunction: ordersApi.getAll,
    dependencies: [],
  });

  return (
    <>
      <Title order={2} my={8}>
        Все заказы
      </Title>
      <Table>
        <Table.Thead>
          <Table.Th>Customer</Table.Th>
          <Table.Th>Delivery</Table.Th>
          <Table.Th>Product</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((record) => {
            return (
              <Table.Tr>
                <Table.Td>(имя и фамилия)</Table.Td>
                <Table.Td>{record.delivery}</Table.Td>
                <Table.Td>
                  (минимум - id, максимум - название продукта по id)
                </Table.Td>
                <Table.Td>(пока не трогать)</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </>
  );
}
