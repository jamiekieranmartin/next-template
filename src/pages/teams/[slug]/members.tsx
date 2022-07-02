import { InvitationsList, TeamMemberForm } from "../../../components";
import { MembersList } from "../../../components/team/members-list";
import { useRole, useSlug } from "../../../hooks";
import { TeamLayout } from "../../../layouts";
import { NextLayoutPage } from "../../../utils/types";

const Page: NextLayoutPage = () => {
  const slug = useSlug();
  const role = useRole({ slug });

  return (
    <>
      {role.data?.role === "owner" ? <TeamMemberForm /> : null}

      <MembersList />

      <InvitationsList />
    </>
  );
};

Page.auth = true;
Page.Layout = TeamLayout;

export default Page;
