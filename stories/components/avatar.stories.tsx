import { Avatar, AvatarProps } from "../../src/components/avatar";

export default {
  title: "Components/Avatar",
  component: Avatar,
  args: {
    name: "Jamie Martin",
  },
};

export const Default = (args: AvatarProps) => <Avatar {...args} />;

export const WithSrc = (args: AvatarProps) => <Avatar {...args} />;
WithSrc.args = {
  src: "https://via.placeholder.com/150",
};
