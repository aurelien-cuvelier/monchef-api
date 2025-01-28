import * as z from "zod";
import { Units } from "@prisma/client";
import {
  CompleteRecipe,
  RelatedRecipeModel,
  CompleteIngredient,
  RelatedIngredientModel,
} from "./index";

export const Recipe_itemModel = z.object({
  id: z.number().int(),
  ingedient_id: z.number().int(),
  unit: z.nativeEnum(Units),
  quantity: z.number(),
  recipe_id: z.number().int(),
});

export interface CompleteRecipe_item extends z.infer<typeof Recipe_itemModel> {
  recipe: CompleteRecipe;
  ingredient: CompleteIngredient;
}

/**
 * RelatedRecipe_itemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRecipe_itemModel: z.ZodSchema<CompleteRecipe_item> = z.lazy(
  () =>
    Recipe_itemModel.extend({
      recipe: RelatedRecipeModel,
      ingredient: RelatedIngredientModel,
    })
);
