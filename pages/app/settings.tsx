import { NextAuthPage } from "../../lib/types";
import { Layout } from "../../components";

const Page: NextAuthPage = () => {
  return (
    <>
      <h2 className="font-medium">Settings</h2>
    </>
  );
};

Page.auth = true;
Page.Layout = Layout;

export default Page;
