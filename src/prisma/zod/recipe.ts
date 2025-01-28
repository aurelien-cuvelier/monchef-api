import * as z from "zod"
import { Difficulty, Meal_role, Tags } from "@prisma/client"
import { CompleteUser, RelatedUserModel, CompleteReview, RelatedReviewModel, CompleteRecipe_item, RelatedRecipe_itemModel, CompleteCountry, RelatedCountryModel } from "./index"

export const RecipeModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  country_a3: z.string(),
  images: z.string().array(),
  duration: z.number().int(),
  diffulty: z.nativeEnum(Difficulty),
  instructions: z.string(),
  meal_role: z.nativeEnum(Meal_role),
  tags: z.nativeEnum(Tags).array(),
  overall_rating: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
  created_by: z.number().int(),
})

export interface CompleteRecipe extends z.infer<typeof RecipeModel> {
  recipe_creator: CompleteUser
  reviews: CompleteReview[]
  items: CompleteRecipe_item[]
  recipe_country: CompleteCountry
}

/**
 * RelatedRecipeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRecipeModel: z.ZodSchema<CompleteRecipe> = z.lazy(() => RecipeModel.extend({
  recipe_creator: RelatedUserModel,
  reviews: RelatedReviewModel.array(),
  items: RelatedRecipe_itemModel.array(),
  recipe_country: RelatedCountryModel,
}))
