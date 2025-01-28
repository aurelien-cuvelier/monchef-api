import {
  Chef_ranks,
  Country,
  Difficulty,
  Meal_role,
  Tags,
  Units,
} from "@prisma/client";
import z from "zod";
import {
  CountryModel,
  Recipe_itemModel,
  RecipeModel,
  UserModel,
} from "../../prisma/zod";
import { ApiReturnDataInterface } from "../app";
import { buildJsonSchemas } from "fastify-zod";

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

export const getMetadataResponseSchema: z.ZodType<getMetadataSuccessfullResponseType> =
  z.object({
    tags: RecipeModel.shape.tags,
    chefRanks: UserModel.shape.chef_rank.array(),
    mealType: RecipeModel.shape.meal_role.array(),
    difficulty: RecipeModel.shape.diffulty.array(),
    units: Recipe_itemModel.shape.unit.array(),
    countries: CountryModel.pick({ name: true, a3: true }).array(),
  });

export const { schemas: metadataSchemas, $ref } = buildJsonSchemas(
  {
    getMetadataResponseSchema,
  },
  {
    $id: "metadataSchemas",
  }
);
