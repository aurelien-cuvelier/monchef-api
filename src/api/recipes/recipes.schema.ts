import { buildJsonSchemas } from "fastify-zod";
import z from "zod";
import {
  CountryModel,
  IngredientModel,
  Recipe_itemModel,
  RecipeModel,
  ReviewModel,
  UserModel,
} from "../../prisma/zod";
import {
  CreateRecipeSuccessfullResponseType,
  GetRecipesSuccessfulResponseType,
} from "./recipes.types";

export const createRecipeSchema = RecipeModel.omit({
  overall_rating: true,
  created_at: true,
  updated_at: true,
  id: true,
}).extend({
  items: Recipe_itemModel.omit({ id: true, recipe_id: true }).array(),
});

const createRecipeReponseSchema: z.ZodType<CreateRecipeSuccessfullResponseType> =
  RecipeModel.pick({ id: true }).extend({ ok: z.literal(true) });

const getRecipesReponseSchema: z.ZodType<GetRecipesSuccessfulResponseType> =
  RecipeModel.pick({ id: true, overall_rating: true })
    .extend({
      items: Recipe_itemModel.pick({ unit: true, quantity: true })
        .extend({ ingredient: IngredientModel.pick({ name: true, id: true }) })
        .array(),
      recipe_country: CountryModel.pick({ name: true, a3: true }),
      recipe_creator: UserModel.pick({
        username: true,
        chef_rank: true,
      }).extend({
        country: CountryModel.pick({ name: true, a3: true }),
      }),
      reviews: ReviewModel.pick({
        id: true,
        created_at: true,
        rating: true,
        description: true,
      })
        .extend({ reviewer: UserModel.pick({ id: true, username: true }) })
        .array(),
    })
    .array();

export const { schemas: recipeSchemas, $ref } = buildJsonSchemas(
  {
    createRecipeSchema,
    createRecipeReponseSchema,
    getRecipesReponseSchema,
  },
  {
    $id: "recipeSchemas",
  }
);
