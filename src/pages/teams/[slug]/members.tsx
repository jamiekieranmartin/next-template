import { InvitationsList, TeamMemberForm } from "../../../components";
import { MembersList } from "../../../components/team/members-list";
import { TeamLayout } from "../../../layouts";
import { useRole, useSlug } from "../../../lib/hooks";
import { NextLayoutPage } from "../../../lib/types";

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
