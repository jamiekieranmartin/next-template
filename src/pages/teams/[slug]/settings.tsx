import { TeamForm, TeamSettings } from "../../../components";
import { TeamLayout } from "../../../layouts";
import { useRole, useSlug } from "../../../lib/hooks";
import { NextLayoutPage } from "../../../lib/types";

const Page: NextLayoutPage = () => {
  const slug = useSlug();
  const role = useRole({ slug });

  return (
    <>
      <TeamForm />

      {role.data?.role === "owner" ? <TeamSettings /> : null}
    </>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
