An opinionated [Next.js](https://nextjs.org/) template to hit the ground running.

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjamiekieranmartin%2Fnext-template&env=DATABASE_URL,GITHUB_ID,GITHUB_SECRET,NEXTAUTH_URL,NEXTAUTH_SECRET,STRIPE_SECRET,NEXT_PUBLIC_STRIPE_SECRET,STRIPE_WEBHOOK&envDescription=Learn%20more%20about%20the%20environment%20variables%20here&envLink=https%3A%2F%2Fgithub.com%2Fjamiekieranmartin%2Fnext-template%2Fblob%2Fmain%2FREADME.md&project-name=next-template&repo-name=next-template"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

- Built on the [Next.JS](https://nextjs.org/) framework
- [TypeScript](https://www.typescriptlang.org/) included
- Styling with [TailwindCSS](https://tailwindcss.com/)
- UI documentation with [Storybook](https://storybook.js.org/)
- **Typed** remote procedure calls with [tRPC](https://trpc.io/)
- Authentication with [NextAuth](https://next-auth.js.org/)
- Google Analytics with [gtag.js](https://developers.google.com/analytics)
- **Typed** ORM generated by [Prisma](https://www.prisma.io/)
- Database/s with [Planetscale](https://planetscale.com/)
- SEO handled with [Next SEO](https://www.npmjs.com/package/next-seo)

## Demo

- https://jamiekieranmartin.app/
- https://storybook.jamiekieranmartin.app/

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Planetscale CLI](https://docs.planetscale.com/concepts/planetscale-environment-setup)

## Environment Variables

### `DATABASE_URL`

[Planetscale Documentation](https://docs.planetscale.com/)

[Installing the CLI](https://docs.planetscale.com/concepts/planetscale-environment-setup)

[Creating a connection string](https://docs.planetscale.com/concepts/connection-strings)

To set up your datbase:

Create your database in planetscale following the tutorial above. Ensure you generate your connection strings too.

Create a branch called `dev` to go alongside your `main` production deployment.

`yarn connect` and `yarn connect:main` will connect to `dev` and `main` respectively.

`yarn push` will push to the connected database. This is only possible on `dev` due to the way Planetscale works. [Read more here](https://docs.planetscale.com/concepts/branching)

### `GITHUB_ID` / `GITHUB_SECRET`

[Creating an OAuth App in Github](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

To set up GitHub for authentication:

Go to Developer Settings on GitHub.
Click on "New GitHub App".

Name your GitHub App. In our example, we'll call it "Next Template (dev)".

Add your homepage URL (or a placeholder, if you don't have a website yet).

For the "Callback URL" field, put http://localhost:3000. Since GitHub only allows one callback URL per app, we have to create separate apps for localhost and production (hence the "dev" name in step 3).

If the "Active" field under "Webhook" is checked, uncheck it. Now, click on "Create Github App".

Once your app is created, you should see the following screen. Click on "Generate a new client secret":

Copy the client secret you generated and paste it under the GITHUB_SECRET value in your Vercel Environment Variables:

Copy the Client ID and paste it under the GITHUB_ID value in your Vercel Environment Variables:

You're all set! You can now go back to the app login page and log in with GitHub.

### `NEXTAUTH_URL` / `NEXTAUTH_SECRET`

[How to deploy with NextAuth](https://next-auth.js.org/deployment)

### `STRIPE_SECRET` / `NEXT_PUBLIC_STRIPE_KEY` / `STRIPE_WEBHOOK`

[Manage your API keys to authenticate requests with Stripe](https://stripe.com/docs/keys)

[Stripe Webhooks Quickstart](https://stripe.com/docs/webhooks/quickstart)

`yarn listen` will enable you to test webhooks locally. Ensure you have the [Stripe CLI](https://stripe.com/docs/stripe-cli) installed.

### `NEXT_PUBLIC_GA_MEASUREMENT_ID`

[Setup Google Analytics](https://developers.google.com/analytics/devguides/collection)

## Development

Environment Variables should look like so:

```bash
# planetscale
DATABASE_URL=mysql://root@127.0.0.1:3310/next-template

# next-auth
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# stripe
STRIPE_SECRET=
NEXT_PUBLIC_STRIPE_SECRET=
STRIPE_WEBHOOK=

# vercel
VERCEL=""
```

## Production

Environment Variables should look like so:

```bash
# planetscale
DATABASE_URL=

# next-auth
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=

# stripe
STRIPE_SECRET=
NEXT_PUBLIC_STRIPE_SECRET=
STRIPE_WEBHOOK=

# ga
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```
