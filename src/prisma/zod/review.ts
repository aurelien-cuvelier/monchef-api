import * as z from "zod";
import {
  CompleteUser,
  RelatedUserModel,
  CompleteRecipe,
  RelatedRecipeModel,
} from "./index";

export const ReviewModel = z.object({
  id: z.number().int(),
  created_at: z.date(),
  title: z.string(),
  rating: z.number(),
  description: z.string().nullable(),
  reviewed_by_user_id: z.number().int(),
  reviewed_recipe_id: z.number().int(),
});

export interface CompleteReview extends z.infer<typeof ReviewModel> {
  reviewer: CompleteUser;
  reviewed_recipe: CompleteRecipe;
}

/**
 * RelatedReviewModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedReviewModel: z.ZodSchema<CompleteReview> = z.lazy(() =>
  ReviewModel.extend({
    reviewer: RelatedUserModel,
    reviewed_recipe: RelatedRecipeModel,
  })
);
