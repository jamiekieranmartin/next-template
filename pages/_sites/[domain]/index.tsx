import { Team } from "@prisma/client";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";
import prisma from "../../../lib/prisma";

interface PathProps extends ParsedUrlQuery {
  domain: string;
}

interface PageProps {
  team?: Team;
}

const Page: NextPage<PageProps> = ({ team }) => {
  return (
    <section className="h-screen max-w-prose mx-auto py-16 px-2 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">{team?.name}</h1>
    </section>
  );
};

export const getStaticPaths: GetStaticPaths<PathProps> = async (params) => {
  const teams = await prisma.team.findMany({
    select: {
      domain: true,
    },
  });

  return {
    paths: teams.flatMap(({ domain }) => {
      return {
        params: {
          domain,
        },
      };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error("No path parameters found");
  const { domain } = params;

  const team = await prisma.team.findFirst({
    where: {
      domain,
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
