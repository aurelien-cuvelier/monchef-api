import { buildJsonSchemas } from "fastify-zod";
import z from "zod";
import { FollowModel } from "../../prisma/zod/follow";
import { RecipeModel } from "../../prisma/zod/recipe";
import { ReviewModel } from "../../prisma/zod/review";
import { UserModel } from "../../prisma/zod/user";
import { GetUserSuccessfullReponseType } from "./users.types";

// const userCore = {
//   id: z.number().int(),
//   username: z.string(),/home/aurelien/monchef-api/src/api/reviews
//   //address: z.string().refine((addr) => EVM_ADDRESS_REGEX.test(addr)),
//   /**
//    * @DEV altering methods (eg. transform) are NOT applied when fastify does its things
//    */
//   avatar: z.string().optional(),
//   bio: z.string().optional(),
//   country_a3: z.string().length(3), //alpha-3
//   twitter: z.string().optional(),
//   discord: z.string().optional(),
//   /**
//    * @BUG If a string is nullable and that null is received, Zod will serialize it to: ""
//    * This will prevent the signature auth to work since the payload has been altered
//    * For now to nullify a field the double quote emptry string "" should be used instead of null
//    */
// };

export const createUserSchema = UserModel.pick({
  username: true,
  avatar: true,
  bio: true,
  country_a3: true,
  twitter: true,
  discord: true,
});

//Currently data to edit is the same as for creation but partial
export const editUserSchema = createUserSchema.partial();

export const followUserSchema = UserModel.pick({ id: true });

export const unfollowUserSchema = followUserSchema;

export const getUsersResponseSchema: z.ZodType<GetUserSuccessfullReponseType> =
  z.array(
    z.object({
      ...UserModel.pick({
        id: true,
        username: true,
        avatar: true,
        bio: true,
        country_a3: true,
        twitter: true,
        discord: true,
        chef_rank: true,
        created_at: true,
      }).strict().shape,
      _count: z
        .object({
          recipes: z.number(),
          followers: z.number(),
          following: z.number(),
          reviews: z.number(),
        })
        .strict(),
      recipes: z.array(
        z.object(
          RecipeModel.pick({
            id: true,
            name: true,
            overall_rating: true,
          }).strict().shape
        )
      ),
      reviews: z.array(
        z
          .object(ReviewModel.pick({ id: true, rating: true }).strict().shape)
          .extend({
            reviewed_recipe: RecipeModel.pick({
              id: true,
              name: true,
            }).strict(),
          })
      ),
      followers: z.array(FollowModel.pick({ followerId: true }).strict()),
      following: z.array(FollowModel.pick({ followingId: true }).strict()),
    })
  );

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    editUserSchema,
    followUserSchema,
    unfollowUserSchema,
    getUsersResponseSchema,
  },
  {
    $id: "userSchemas",
  }
);
