# Minimal Shop Monorepo

This repository contains a simple ecommerce example with a Next.js client, Next.js admin dashboard and an Express API server.

## Apps

- `apps/client` – storefront for customers
- `apps/admin` – admin dashboard
- `server` – Express REST API

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

The `dev` script runs client, admin and server concurrently.

## Build

```bash
npm run build
```

## Seed

```bash
npm run seed
```

## API Overview

See `server/routes` for available endpoints.
