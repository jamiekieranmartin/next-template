import { useEffect, useState } from "react";
import router, { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

import { SignIn } from "@/components";
import { AppLayout } from "@/layouts";
import { NextLayoutPage } from "@/utils/types";

const Page: NextLayoutPage = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const { query } = useRouter();
  const error = String(query.error ?? "");

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status]);

  return (
    <>
      <div className="mt-8 mx-auto sm:w-full w-11/12 sm:max-w-md">
        <SignIn
          loading={loading}
          signIn={() => {
            setLoading(true);
            signIn("github", {
              callbackUrl: "/teams",
            });
          }}
          error={error}
        />
      </div>
    </>
  );
};

Page.auth = false;
Page.Layout = AppLayout;

export default Page;
