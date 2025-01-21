import {
  Chef_ranks,
  Country,
  Difficulty,
  Meal_type,
  Tags,
  Units,
} from "@prisma/client";
import { ApiReturnDataInterface } from "../app";

export type getMetadataResponseType = ApiReturnDataInterface<{
  tags: Tags[];
  chefRanks: Chef_ranks[];
  mealType: Meal_type[];
  difficulty: Difficulty[];
  units: Units[];
  countries: Pick<Country, "name" | "a3">[];
}>;
