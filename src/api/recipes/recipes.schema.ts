import { Difficulty, Meal_type, Recipe, Tags, Units } from "@prisma/client";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { EVM_ADDRESS_REGEX } from "../../shared";
import { ApiReturnDataInterface } from "../app";

export type CreateRecipeResponseType = ApiReturnDataInterface<
  { id: Recipe["id"] } & { ok: true }
>;

const recipeItemCore = {
  ingedient_id: z.number().int(),
  unit: z.enum([
    Units.GRAM,
    Units.KILOGRAM,
    Units.LITER,
    Units.MILILITER,
    Units.PIECE,
    Units.TABLESPOON,
    Units.TEASPOON,
  ]),
  quantity: z.number(),
  recipe_id: z.number().int(),
};

const recipeCore = {
  name: z.string(),
  description: z.string(),
  country: z.string().length(3), //alpha-3
  images: z.array(z.string()),
  duration: z.number().int(),
  diffulty: z.enum([Difficulty.EASY, Difficulty.HARD, Difficulty.MEDIUM]),
  recipe: z.string(),
  meal_role: z.enum([
    Meal_type.DESSERT,
    Meal_type.MAIN_DISH,
    Meal_type.SIDE_DISH,
  ]),
  tags: z.enum([
    Tags.VEGAN,
    Tags.VEGETARIAN,
    Tags.GLUTEN_FREE,
    Tags.DAIRY_FREE,
    Tags.LOW_CARB,
    Tags.PALEO,
    Tags.KOSHER,
    Tags.HALAL,
  ]),
  overall_rating: z.number(), // 1, 1.5, 2, 2.5, ..., 5

  created_by: z.number().int(),

  items: z.array(z.object(recipeItemCore)),
};

export const createRecipeSchema = z
  .object({
    ...recipeCore,
    address: z.string().refine((addr) => EVM_ADDRESS_REGEX.test(addr)),
  })
  .omit({ overall_rating: true });

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

export const { schemas: recipeSchemas, $ref } = buildJsonSchemas(
  {
    createRecipeSchema,
  },
  {
    $id: "recipeSchemas",
  }
);
