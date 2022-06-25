import { useEffect } from "react";
import { useRouter } from "next/router";

import { SignIn } from "../components";
import { AppLayout } from "../layouts";
import { useAuth } from "../lib/hooks";
import { NextLayoutPage } from "../lib/types";

const Page: NextLayoutPage = () => {
  const router = useRouter();

  const { session, signIn, loading, error } = useAuth();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status]);

  return (
    <>
      <div className="mt-8 mx-auto sm:w-full w-11/12 sm:max-w-md">
        <SignIn loading={loading} signIn={signIn} error={error} />
      </div>
    </>
  );
};

Page.auth = false;
Page.Layout = AppLayout;

export default Page;
