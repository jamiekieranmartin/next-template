import { Button, Card } from "../../src/components";
import { List, ListProps } from "../../src/components/list";

export default {
  title: "Components/List",
  component: List,
};

export const Default = (args: ListProps) => <List {...args} />;

export const WithLoading = (args: ListProps) => <List {...args} />;
WithLoading.args = {
  isLoading: true,
};

export const WithItems = (args: ListProps) => <List {...args} />;
WithItems.args = {
  data: [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
  ],
  columns: [
    {
      className: "ml-4 flex items-center font-medium text-gray-900",
      render: ({ name }) => name,
    },
    {
      render: ({ id }) => (
        <Button onClick={() => window.alert(id)}>Accept</Button>
      ),
    },
  ],
} as ListProps<{ id: number; name: string }>;

export const WithEmptyItems = (args: ListProps) => <List {...args} />;
WithEmptyItems.args = {
  data: [],
  columns: [],
};

export const WithEmptyLabel = (args: ListProps) => <List {...args} />;
WithEmptyLabel.args = {
  data: [],
  columns: [],
  emptyLabel: "👻 No items 👻",
};

export const InACard = (args: ListProps) => (
  <Card>
    <List {...args} />
  </Card>
);
InACard.args = {
  data: [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
  ],
  columns: [
    {
      className: "ml-4 flex items-center font-medium text-gray-900",
      render: ({ name }) => name,
    },
    {
      render: ({ id }) => (
        <Button onClick={() => window.alert(id)}>Accept</Button>
      ),
    },
  ],
} as ListProps<{ id: number; name: string }>;
