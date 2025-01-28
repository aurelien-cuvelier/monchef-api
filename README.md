# Foodelics API

Foodelics is a Monad native platform designed to bring food enthusiasts together by combining recipe sharing, restaurant recommendations, and food photo posting into a single, rewarding experience. It eliminates the need for multiple apps by creating a unified space where users can connect, share their culinary adventures, and be rewarded for their contributions through tokens or NFTs. With a focus on authentic, community-driven content, Foodelics aims to build a vibrant ecosystem for food lovers while leveraging blockchain for transparency and engagement.

### Technologies

- **Node.js** (Runtime)
- **TypeScript** (Static typing)
- **Prisma** (Database ORM)
- **Zod** (Validation)
- **Fastify** (Web framework)
- **PostgreSQL** (Database)
- **Jest** (Testing)

```
📦
├─ .dockerignore
├─ .env.example
├─ .github
│  └─ workflows
│     └─ fly-deploy.yml
├─ .gitignore
├─ Dockerfile
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
│  │  │  ├─ 20250122111527_init
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250125135041_title_on_reviews
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
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
│  ├─ recipes.test.ts
│  ├─ reviews.test.ts
│  ├─ shared.ts
│  ├─ users.test.ts
│  └─ utils.ts
└─ tsconfig.json
```
