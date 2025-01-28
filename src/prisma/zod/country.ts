import * as z from "zod";
import {
  CompleteUser,
  RelatedUserModel,
  CompleteRecipe,
  RelatedRecipeModel,
} from "./index";

export const CountryModel = z.object({
  id: z.number().int(),
  name: z.string(),
  a2: z.string(),
  a3: z.string(),
  flag: z.string().nullable(),
});

export interface CompleteCountry extends z.infer<typeof CountryModel> {
  users: CompleteUser[];
  recipes: CompleteRecipe[];
}

/**
 * RelatedCountryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCountryModel: z.ZodSchema<CompleteCountry> = z.lazy(() =>
  CountryModel.extend({
    users: RelatedUserModel.array(),
    recipes: RelatedRecipeModel.array(),
  })
);
