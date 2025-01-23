import { Difficulty, Meal_role, Tags, Units } from "@prisma/client";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

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
  country_a3: z.string().length(3), //alpha-3
  images: z.array(z.string()),
  duration: z.number().int(),
  diffulty: z.enum([Difficulty.EASY, Difficulty.HARD, Difficulty.MEDIUM]),
  instructions: z.string(),
  meal_role: z.enum([
    Meal_role.DESSERT,
    Meal_role.MAIN_DISH,
    Meal_role.SIDE_DISH,
  ]),
  tags: z.array(
    z.enum([
      Tags.VEGAN,
      Tags.VEGETARIAN,
      Tags.GLUTEN_FREE,
      Tags.DAIRY_FREE,
      Tags.LOW_CARB,
      Tags.PALEO,
      Tags.KOSHER,
      Tags.HALAL,
    ])
  ),
  overall_rating: z.number(), // 1, 1.5, 2, 2.5, ..., 5

  created_by: z.number().int(),

  items: z.array(z.object(recipeItemCore).omit({ recipe_id: true })),
};

export const createRecipeSchema = z
  .object({
    ...recipeCore,
  })
  .omit({ overall_rating: true })
  .strict();

export const { schemas: recipeSchemas, $ref } = buildJsonSchemas(
  {
    createRecipeSchema,
  },
  {
    $id: "recipeSchemas",
  }
);
