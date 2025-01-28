import { Prisma } from "@prisma/client";
import { ApiReturnDataInterface } from "../app";

export const ingredientsSelect = {
  name: true,
  description: true,
  thumbnail: true,
  id: true,
};

export type GetIngredientsSuccessfullReponseType = Prisma.IngredientGetPayload<{
  select: typeof ingredientsSelect;
}>[];

export type GetIngredientsApiReponseType =
  ApiReturnDataInterface<GetIngredientsSuccessfullReponseType>;
