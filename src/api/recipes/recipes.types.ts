import { Prisma, Recipe } from "@prisma/client";
import z from "zod";
import { ApiReturnDataInterface } from "../app";
import { createRecipeSchema } from "./recipes.schema";

export const recipeSelect = {
  items: {
    select: {
      unit: true,
      quantity: true,
      ingredient: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  },
  recipe_country: {
    select: {
      name: true,
      a3: true,
    },
  },
  recipe_creator: {
    select: {
      username: true,
      chef_rank: true,
      country: {
        select: {
          name: true,
          a3: true,
        },
      },
    },
  },
  reviews: {
    select: {
      id: true,
      created_at: true,
      rating: true,
      reviewer: {
        select: {
          username: true,
          id: true,
        },
      },
      description: true,
    },
  },
};

export type GetRecipesSuccessfulResponseType = Prisma.RecipeGetPayload<{
  select: typeof recipeSelect;
}>[];

export type GetRecipesResponseType =
  ApiReturnDataInterface<GetRecipesSuccessfulResponseType>;

export type CreateRecipeSuccessfullResponseType = { id: Recipe["id"] } & {
  ok: true;
};

export type CreateRecipeResponseType =
  ApiReturnDataInterface<CreateRecipeSuccessfullResponseType>;

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
