import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Link } from "../../components";

const Page: NextPage = () => {
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.href);
    }
  }, []);

  return (
    <section className="h-screen max-w-prose mx-auto py-16 px-2 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Home</h1>

      <Link target="_blank" href={host.replace("//", "//app.")}>
        Go to app
      </Link>
    </section>
  );
};

export default Page;
