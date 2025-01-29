# Foodelics API

[![basic-validation](https://github.com/aurelien-cuvelier/foodelics-api/actions/workflows/pipeline.yml/badge.svg)](https://github.com/aurelien-cuvelier/foodelics-api/actions/workflows/pipeline.yml)

Foodelics is a Monad native platform designed to bring food enthusiasts together by combining recipe sharing, restaurant recommendations, and food photo posting into a single, rewarding experience. It eliminates the need for multiple apps by creating a unified space where users can connect, share their culinary adventures, and be rewarded for their contributions through tokens or NFTs. With a focus on authentic, community-driven content, Foodelics aims to build a vibrant ecosystem for food lovers while leveraging blockchain for transparency and engagement.

### Stack
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## Prerequisites

- Node.js (version specified in `Dockerfile`)
- pnpm (version specified in `package.json`)
- A Postgresql database
- Fly.io account (if you want to deploy following the current workflow)

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-username/foodelics-api.git
   cd foodelics-api
   ```

2. Install dependencies:

   ```
   pnpm install
   ```
   
3. Generate Prisma models & zod objects

   ```
   pnpm run prisma:generate
   ```
   
4. Set up environment variables:
   Create a `.env` file in the root directory following the .env.example model:

   ```
   NODE_ENV=dev
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/postgres?schema=public"
   APP_PORT=8080
   ```

5. Migrate the database:
   This will create the necessary tables in your database

   ```
   pnpm run prisma:migrate
   ```
   
6. Start the backend:
   This will automatically initialize some data in the database if it is reachable
   ```
   pnpm run dev
   ```

7. Run tests: You should have all tests passing
   ```
   pnpm run test
   ```

## Format code
```
pnpm run format
```

## API Documentation
The API is implementing swagger which can be accessed at:
```
http://localhost:APP_PORT/docs
```

## Project structure
```
📦
├─ .dockerignore
├─ .env.example
├─ .github
│  └─ workflows
│     └─ pipeline.yml
├─ .gitignore
├─ .prettierignore
├─ .prettierrc.json
├─ Dockerfile
├─ README.md
├─ fly.toml
├─ jest.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ src
│  ├─ api
│  │  ├─ app.ts
│  │  ├─ auth.schemas.ts
│  │  ├─ fastifyModules.ts
│  │  ├─ ingredients
│  │  │  ├─ ingredients.controller.ts
│  │  │  ├─ ingredients.routes.ts
│  │  │  ├─ ingredients.schema.ts
│  │  │  ├─ ingredients.service.ts
│  │  │  └─ ingredients.types.ts
│  │  ├─ metadata
│  │  │  ├─ metadata.controller.ts
│  │  │  ├─ metadata.routes.ts
│  │  │  ├─ metadata.schema.ts
│  │  │  └─ metadata.service.ts
│  │  ├─ middlewares
│  │  │  ├─ checkReviewRating.ts
│  │  │  ├─ requestLogging.ts
│  │  │  └─ walletSignature.ts
│  │  ├─ recipes
│  │  │  ├─ recipes.controller.ts
│  │  │  ├─ recipes.routes.ts
│  │  │  ├─ recipes.schema.ts
│  │  │  ├─ recipes.service.ts
│  │  │  └─ recipes.types.ts
│  │  ├─ reviews
│  │  │  ├─ reviews.controller.ts
│  │  │  ├─ reviews.routes.ts
│  │  │  ├─ reviews.schema.ts
│  │  │  ├─ reviews.service.ts
│  │  │  └─ reviews.types.ts
│  │  └─ users
│  │     ├─ users.controller.ts
│  │     ├─ users.routes.ts
│  │     ├─ users.schema.ts
│  │     ├─ users.service.ts
│  │     └─ users.types.ts
│  ├─ config.ts
│  ├─ index.ts
│  ├─ logger.ts
│  ├─ misc
│  │  └─ countries-iso-3166.json
│  ├─ prisma
│  │  ├─ migrations
│  │  │  ├─ 20250128173602_init
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  ├─ nullishToNullable.sh
│  │  ├─ schema.prisma
│  │  └─ zod
│  │     ├─ country.ts
│  │     ├─ follow.ts
│  │     ├─ index.ts
│  │     ├─ ingredient.ts
│  │     ├─ recipe.ts
│  │     ├─ recipe_item.ts
│  │     ├─ review.ts
│  │     └─ user.ts
│  ├─ shared.ts
│  └─ utils
│     ├─ initCountries.ts
│     ├─ initIngredients.ts
│     └─ updateRecipeRating.ts
├─ tests
│  ├─ basic.test.ts
│  ├─ follows.test.ts
│  ├─ main.test.ts
│  ├─ recipes.test.ts
│  ├─ reviews.test.ts
│  ├─ shared.ts
│  ├─ users.test.ts
│  └─ utils.ts
└─ tsconfig.json
```
