import { buildJsonSchemas } from "fastify-zod";
import z from "zod";
import { IngredientModel } from "../../prisma/zod";
import { GetIngredientsSuccessfullReponseType } from "./ingredients.types";

export const getIngredientsResponseSchema: z.ZodType<GetIngredientsSuccessfullReponseType> =
  z.array(
    IngredientModel.pick({
      created_by_user_id: true,
      id: true,
      name: true,
      description: true,
      thumbnail: true,
    })
  );

export const createIngredientSchema = IngredientModel.pick({
  name: true,
  description: true,
});

const createIngredientResponseSchema = IngredientModel.pick({
  id: true,
}).extend({ ok: z.literal(true) });

export const { schemas: ingredientsSchema, $ref } = buildJsonSchemas(
  {
    getIngredientsResponseSchema,
    createIngredientSchema,
    createIngredientResponseSchema,
  },
  {
    $id: "ingredientsSchema",
  }
);
