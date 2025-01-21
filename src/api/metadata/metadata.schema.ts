import {
  Chef_ranks,
  Country,
  Difficulty,
  Meal_role,
  Tags,
  Units,
} from "@prisma/client";
import { ApiReturnDataInterface } from "../app";

export type getMetadataSuccessfullResponseType = {
  tags: Tags[];
  chefRanks: Chef_ranks[];
  mealType: Meal_role[];
  difficulty: Difficulty[];
  units: Units[];
  countries: Pick<Country, "name" | "a3">[];
};
export type getMetadataResponseType =
  ApiReturnDataInterface<getMetadataSuccessfullResponseType>;
