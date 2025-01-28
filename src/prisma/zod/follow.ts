import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const FollowModel = z.object({
  followerId: z.number().int(),
  followingId: z.number().int(),
})

export interface CompleteFollow extends z.infer<typeof FollowModel> {
  follower: CompleteUser
  following: CompleteUser
}

/**
 * RelatedFollowModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFollowModel: z.ZodSchema<CompleteFollow> = z.lazy(() => FollowModel.extend({
  follower: RelatedUserModel,
  following: RelatedUserModel,
}))
