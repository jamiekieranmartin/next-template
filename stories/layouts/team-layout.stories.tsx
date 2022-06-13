import { TeamLayout, TeamLayoutProps } from "../../src/layouts/team";

export default {
  title: "Layouts/TeamLayout",
  component: TeamLayout,
  args: {
    children: "TeamLayout",
  },
};

export const Default = (args: TeamLayoutProps) => <TeamLayout {...args} />;
