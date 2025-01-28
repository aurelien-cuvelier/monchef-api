import * as z from "zod";
import { Chef_ranks } from "@prisma/client";
import {
  CompleteRecipe,
  RelatedRecipeModel,
  CompleteReview,
  RelatedReviewModel,
  CompleteCountry,
  RelatedCountryModel,
  CompleteFollow,
  RelatedFollowModel,
} from "./index";

export const UserModel = z.object({
  id: z.number().int(),
  username: z.string(),
  address: z.string(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  country_a3: z.string(),
  twitter: z.string().nullable(),
  discord: z.string().nullable(),
  chef_rank: z.nativeEnum(Chef_ranks),
  created_at: z.date(),
  updated_at: z.date(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  recipes: CompleteRecipe[];
  reviews: CompleteReview[];
  country: CompleteCountry;
  followers: CompleteFollow[];
  following: CompleteFollow[];
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    recipes: RelatedRecipeModel.array(),
    reviews: RelatedReviewModel.array(),
    country: RelatedCountryModel,
    followers: RelatedFollowModel.array(),
    following: RelatedFollowModel.array(),
  })
);
