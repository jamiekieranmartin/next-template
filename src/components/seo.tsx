import { DefaultSeo } from "next-seo";

export const SEO = () => (
  <DefaultSeo
    title="*"
    description="*"
    canonical="https://*.vercel.app"
    openGraph={{
      type: "website",
      locale: "en_AU",
      url: "https://*.vercel.app",
      site_name: "*",
      images: [
        {
          url: "/android-chrome-512x512.png",
          width: 800,
          height: 600,
          alt: "*",
          type: "image/png",
        },
      ],
    }}
    additionalLinkTags={[
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "true",
      },
      {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
        rel: "stylesheet",
      },
    ]}
  />
);
