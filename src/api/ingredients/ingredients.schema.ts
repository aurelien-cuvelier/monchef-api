import { Ingredient } from "@prisma/client";
import { ApiReturnDataInterface } from "../app";

export type getIngredientsResponseType = ApiReturnDataInterface<
  Pick<Ingredient, "name" | "description" | "thumbnail">[]
>;
