import { Prisma } from "@prisma/client";
import z from "zod";
import { ApiReturnDataInterface } from "../app";
import { createIngredientSchema } from "./ingredients.schema";

export const ingredientsSelect = {
  name: true,
  created_by_user_id: true,
  description: true,
  thumbnail: true,
  id: true,
};

export type GetIngredientsSuccessfullReponseType = Prisma.IngredientGetPayload<{
  select: typeof ingredientsSelect;
}>[];

export type GetIngredientsApiReponseType =
  ApiReturnDataInterface<GetIngredientsSuccessfullReponseType>;

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

export type CreateIngredientSuccessfullResponseType =
  Prisma.IngredientGetPayload<{
    select: { id: true };
  }> & { ok: true };

export type CreateIngredientApiReponseType =
  ApiReturnDataInterface<CreateIngredientSuccessfullResponseType>;
