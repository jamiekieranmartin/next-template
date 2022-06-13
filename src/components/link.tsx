import clsx from "clsx";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = {
  href?: NextLinkProps["href"];
  active?: boolean;
} & React.ComponentPropsWithRef<"a">;

export const Link: React.FC<LinkProps> = ({
  className,
  active,
  children,
  href,
  ...props
}) => {
  if (!href) {
    return (
      <a
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
  }

  return (
    <NextLink href={href}>
      <a
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
    </NextLink>
  );
};
