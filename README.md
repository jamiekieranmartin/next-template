# next-template

A highly opinionated [Next.js](https://nextjs.org/) template to hit the ground running 🏃‍♂️

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjamiekieranmartin%2Fnext-template&env=DATABASE_URL,GITHUB_ID,GITHUB_SECRET,NEXTAUTH_URL,NEXTAUTH_SECRET,STRIPE_SECRET,NEXT_PUBLIC_STRIPE_SECRET,STRIPE_WEBHOOK,NEXT_PUBLIC_LOGROCKET_ID&envDescription=Learn%20more%20about%20the%20environment%20variables%20here&envLink=https%3A%2F%2Fgithub.com%2Fjamiekieranmartin%2Fnext-template%2Fblob%2Fmain%2FREADME.md&project-name=next-template&repo-name=next-template"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

- Built on the [Next.JS](https://nextjs.org/) framework
- [TypeScript](https://www.typescriptlang.org/) by default
- End-to-end typesafe APIs made easy with [tRPC](https://trpc.io/)
- Typesafe ORM with [Prisma](https://www.prisma.io/)
- Infinitely scaleable database with [Planetscale](https://planetscale.com/)
- No-nonsense auth with [NextAuth](https://next-auth.js.org/)
- Styling with [TailwindCSS](https://tailwindcss.com/)
- UI documentation with [Storybook](https://storybook.js.org/)
- Analytics, Monitoring + Bug-Tracking with [LogRocket](https://logrocket.com)
- SEO handled with [Next SEO](https://www.npmjs.com/package/next-seo)

---

## Demo

- https://jamiekieranmartin.app/
- https://storybook.jamiekieranmartin.app/

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Planetscale CLI](https://docs.planetscale.com/concepts/planetscale-environment-setup)

## Getting started locally

### Setup your local environment

Follow the [Environment Variables](#environment-variables) guides

### Connect to your branch

Follow the [PlanetScale](#databaseurl) guide and connect to your branch

```bash
# in this case we're connecting to the `dev` branch
yarn db:connect dev
```

If your prisma types are out of sync, run `yarn db:push` whilst your connection to the database is open.

### Start listening to Stripe webhooks (not always necessary)

```bash
yarn stripe:listen
```

### Run Next.JS

```bash
yarn dev
```

## Environment Variables

### `DATABASE_URL`

[Planetscale Documentation](https://docs.planetscale.com/)

[Installing the CLI](https://docs.planetscale.com/concepts/planetscale-environment-setup)

[Creating a connection string](https://docs.planetscale.com/concepts/connection-strings)

To set up your datbase:

- Create your database in planetscale following the tutorial above. Ensure you generate your connection strings too.

- Create a branch called `dev` or whatever you want it called to go alongside your `main` production deployment.

`yarn db:connect <branch>` will connect to a given branch.

`yarn db:push` will push to the connected database. This is only possible on development branches due to the way Planetscale works. [Read more here](https://docs.planetscale.com/concepts/branching)

---

### `GITHUB_ID / GITHUB_SECRET`

[Creating an OAuth App in Github](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

To set up GitHub for authentication:

- Go to Developer Settings on GitHub. Click on "New GitHub App".

- Name your GitHub App. In our example, we'll call it "next-template (dev)".

- Add your homepage URL (or a placeholder, if you don't have a website yet).

- For the "Callback URL" field, put `http://localhost:3000`. Since GitHub only allows one callback URL per app, we have to create separate apps for localhost and production (hence the "dev" name in step 3).

- If the "Active" field under "Webhook" is checked, uncheck it. Now, click on "Create Github App".

- Once your app is created, you should see the following screen. Click on "Generate a new client secret":

- Copy the client secret you generated and paste it under the `GITHUB_SECRET` value in your Environment Variables:

- Copy the Client ID and paste it under the `GITHUB_ID` value in your Environment Variables:

You're all set! You can now go back to the app login page and log in with GitHub.

---

### `NEXTAUTH_URL / NEXTAUTH_SECRET`

If you're deploying with Vercel, `NEXTAUTH_URL` is only really necessary for local development. Just ensure it's set to `http://localhost:3000` locally

[How to deploy with NextAuth](https://next-auth.js.org/deployment)

---

### `STRIPE_KEY / NEXT_PUBLIC_STRIPE_KEY / STRIPE_WEBHOOK`

[Manage your API keys to authenticate requests with Stripe](https://stripe.com/docs/keys)

[Stripe Webhooks Quickstart](https://stripe.com/docs/webhooks/quickstart)

`yarn stripe:listen` will enable you to test webhooks locally. Ensure you have the [Stripe CLI](https://stripe.com/docs/stripe-cli) installed.

---

### `NEXT_PUBLIC_LOGROCKET_ID`

[LogRocket Quickstart](https://docs.logrocket.com/docs/quickstart)
