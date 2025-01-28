import { buildJsonSchemas } from "fastify-zod";
import z from "zod";
import { IngredientModel } from "../../prisma/zod";
import { GetIngredientsSuccessfullReponseType } from "./ingredients.types";

export const getIngredientsResponseSchema: z.ZodType<GetIngredientsSuccessfullReponseType> =
  z.array(
    IngredientModel.pick({
      id: true,
      name: true,
      description: true,
      thumbnail: true,
    })
  );

export const { schemas: ingredientsSchema, $ref } = buildJsonSchemas(
  {
    getIngredientsResponseSchema,
  },
  {
    $id: "ingredientsSchema",
  }
);
