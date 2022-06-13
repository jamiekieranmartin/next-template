import { Layout } from "../layouts";
import { NextAuthPage } from "../lib/types";

const Page: NextAuthPage = () => {
  return (
    <>
      <h2 className="text-xl font-bold">Settings</h2>
    </>
  );
};

Page.auth = true;
Page.Layout = Layout;

export default Page;
