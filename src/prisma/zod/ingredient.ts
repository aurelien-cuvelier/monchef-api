import * as z from "zod";
import { CompleteRecipe_item, RelatedRecipe_itemModel } from "./index";

export const IngredientModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  thumbnail: z.string().nullable(),
  created_by_user_id: z.number().int().nullable(),
});

export interface CompleteIngredient extends z.infer<typeof IngredientModel> {
  used_in: CompleteRecipe_item[];
}

/**
 * RelatedIngredientModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedIngredientModel: z.ZodSchema<CompleteIngredient> = z.lazy(
  () =>
    IngredientModel.extend({
      used_in: RelatedRecipe_itemModel.array(),
    })
);
