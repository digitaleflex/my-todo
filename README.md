# My Todo SaaS

Personal productivity SaaS built with Next.js, PostgreSQL/Neon, Prisma and Better Auth.

## Architecture

- Next.js App Router + TypeScript
- PostgreSQL hosted on Neon
- Prisma ORM
- Better Auth
- Tailwind CSS
- Docker for VPS deployment
- No cron required for V1

## Development

    pnpm install
    cp .env.example .env
    pnpm db:generate
    pnpm db:push
    pnpm dev

## Deployment

The application is designed to run as a single Docker container on the VPS while Neon remains the managed PostgreSQL provider.
