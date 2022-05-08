import { Team } from "@prisma/client";
import { GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";
import prisma from "../../../lib/prisma";

interface PathProps extends ParsedUrlQuery {
  slug: string;
}

interface PageProps {
  team: Team;
}

const Page: NextPage<PageProps> = ({ team }) => {
  return (
    <section className="h-screen max-w-prose mx-auto py-16 px-2 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">{team.name}</h1>
    </section>
  );
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error("No path parameters found");
  const { slug } = params;

  const team = await prisma.team.findFirst({
    where: {
      slug,
    },
  });

  if (!team) return { notFound: true, revalidate: 10 };

  return {
    props: {
      team,
    },
    revalidate: 3600,
  };
};

export default Page;
