import { Ingredient } from "@prisma/client";
import { ApiReturnDataInterface } from "../app";

export type getIngredientsSuccessfullResponseType = Pick<
  Ingredient,
  "name" | "description" | "thumbnail" | "id"
>[];

export type getIngredientsResponseType =
  ApiReturnDataInterface<getIngredientsSuccessfullResponseType>;
