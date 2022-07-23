import { Card, Text } from "@/components";
import { SiteLayout } from "@/layouts";
import { NextLayoutPage } from "@/utils/types";

const Page: NextLayoutPage = () => {
  return (
    <Card>
      <Text>
        <h2>Home 🏠</h2>

        <p>This is the Home page for your Next.js application.</p>

        <p>
          You can choose to treat it as a marketing page or make it part of your
          web app. You decide.
        </p>
      </Text>
    </Card>
  );
};

Page.auth = false;
Page.Layout = SiteLayout;

export default Page;
