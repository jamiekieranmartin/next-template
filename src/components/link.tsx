import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import clsx from "clsx";

export type LinkProps = {
  href?: NextLinkProps["href"];
  active?: boolean;
} & React.ComponentPropsWithRef<"a">;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, active, children, href, ...props }, ref) => {
    const Component = (
      <a
        ref={ref}
        href={href}
        className={clsx(
          "cursor-pointer",
          {
            "bg-black/5": active,
          },
          className
        )}
        {...props}
      >
        {children}
      </a>
    );

    if (!href || href.startsWith("http")) {
      return Component;
    }

    return <NextLink href={href}>{Component}</NextLink>;
  }
);
