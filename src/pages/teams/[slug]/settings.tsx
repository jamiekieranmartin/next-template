import { TeamForm, TeamSettings } from "../../../components";
import { useRole, useSlug } from "../../../hooks";
import { TeamLayout } from "../../../layouts";
import { NextLayoutPage } from "../../../utils/types";

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
