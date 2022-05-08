import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-domain)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.jamiekieranmartin.app)
  const hostname = req.headers.get("host")?.replace(/:\d+/g, "");
  if (!hostname)
    return new Response(null, {
      status: 400,
      statusText: "No hostname found in request headers",
    });

  let domain =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? // You have to replace ".jamiekieranmartin.app" with your own domain if you deploy this example under your domain.
        // You can use wildcard subdomains on .vercel.app links that are associated with your Vercel team domain
        // in this case, our team domain is "platformize", thus *.next-jamiekieranmartin.vercel.app works
        hostname
          .replace(`.jamiekieranmartin.app`, "")
          .replace(`.next-jamiekieranmartin.vercel.app`, "")
      : hostname.replace(`.localhost`, "");

  const deployment_url = req.headers.get("x-forwarded-host");
  if (deployment_url?.includes(".localhost")) {
    domain = deployment_url?.replace(".localhost:3000", "");
  }

  if (pathname.startsWith(`/_sites`))
    return new Response(null, {
      status: 404,
    });

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (domain == "app") {
      if (
        pathname === "/login" &&
        (req.cookies["next-auth.session-token"] ||
          req.cookies["__Secure-next-auth.session-token"])
      ) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      url.pathname = `/app${pathname}`;
      return NextResponse.rewrite(url);
    }

    if (
      domain === "localhost" ||
      hostname === "next-jamiekieranmartin.vercel.app"
    ) {
      url.pathname = `/home`;
      return NextResponse.rewrite(url);
    }

    url.pathname = `/_sites/${domain}${pathname}`;
    return NextResponse.rewrite(url);
  }
}
