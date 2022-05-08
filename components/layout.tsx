import { trpc } from "../lib/trpc";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren } from "react";
import { signIn, signOut } from "next-auth/react";
import { Avatar, Button, Link } from ".";
import { useRouter } from "next/router";

export const Auth = () => {
  const user = trpc.useQuery(["user.get"], {
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  if (user.isLoading) return null;

  if (!user.data)
    return (
      <div className="flex gap-4">
        <Button size="sm" onClick={() => signIn()}>
          Sign in
        </Button>
        <Button size="sm" onClick={() => signIn()}>
          Sign up
        </Button>
      </div>
    );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="rounded-full">
        <Avatar src={user.data?.image} name={user.data?.name} />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-20 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-300 border rounded grid ring-1 ring-black ring-opacity-5 focus:outline-none">
          {[
            {
              href: "/u",
              children: "Dashboard",
            },
            {
              href: "/create",
              children: "Create a Team",
            },
            { href: "/invitations", children: "Invitations" },
            { href: "/settings", children: "Settings" },
          ].map(({ href, children }, i) => (
            <Menu.Item key={i}>
              {({ active }) => (
                <Link
                  href={href}
                  active={active}
                  className="px-3 py-2 hover:bg-black/5 transform duration-300 ease-in-out"
                >
                  {children}
                </Link>
              )}
            </Menu.Item>
          ))}

          <Menu.Item>
            {({ active }) => (
              <Link
                onClick={() => signOut()}
                active={active}
                className="px-3 py-2 hover:bg-black/5 transform duration-300 ease-in-out"
              >
                Sign out
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export type LayoutProps = {};

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
}) => {
  const router = useRouter();
  const slug = String(router.query.slug ?? "");

  return (
    <>
      <nav className="max-w-screen-lg mx-auto p-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link href={router.asPath.includes("/u") ? "/u" : "/"}>
            <h1 className="text-lg font-medium border rounded-full w-12 h-12"></h1>
          </Link>

          {slug ? (
            <>
              <Divider />
              <Link href={`/${slug}`}>
                <h1 className="text-lg font-medium">{slug}</h1>
              </Link>
            </>
          ) : null}
        </div>

        <Auth />
      </nav>

      <main className="max-w-prose mx-auto p-4 grid gap-8">{children}</main>
    </>
  );
};

const Divider = () => (
  <div className="hidden text-gray-200 dark:text-gray-600 sm:block">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 undefined"
    >
      <path
        d="M9.75 20.25L14.25 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </svg>
  </div>
);
