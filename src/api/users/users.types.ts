import { Follow, Prisma, User } from "@prisma/client";
import z from "zod";
import { ApiReturnDataInterface } from "../app";
import {
  createUserSchema,
  editUserSchema,
  followUserSchema,
  unfollowUserSchema,
} from "./users.schema";

export const userSelect = {
  id: true,
  username: true,
  avatar: true,
  bio: true,
  country_a3: true,
  twitter: true,
  discord: true,
  chef_rank: true,
  created_at: true,
  _count: {
    select: {
      recipes: true,
      followers: true,
      following: true,
      reviews: true,
    },
  },
  recipes: {
    select: {
      id: true,
      name: true,
      overall_rating: true,
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      reviewed_recipe: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  followers: {
    select: {
      followerId: true,
    },
  },
  following: {
    select: {
      followingId: true,
    },
  },
};

export type GetUserSuccessfullReponseType = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>[];

export type GetUsersResponseType =
  ApiReturnDataInterface<GetUserSuccessfullReponseType>;

export type CreateUserSuccessfullResponseType = { id: User["id"] } & {
  ok: true;
};

export type CreateUserResponseType =
  ApiReturnDataInterface<CreateUserSuccessfullResponseType>;

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type EditUserSuccessfullResponseType = { id: User["id"] } & {
  ok: true;
};

export type EditUserResponseType =
  ApiReturnDataInterface<EditUserSuccessfullResponseType>;

export type EditUserInput = z.infer<typeof editUserSchema>;
/**
 * @DEV For follow/unfollow responses we will return the id of the follower to comply with the other reponse types
 * as the unique id of this table is not scalar
 */
export type FollowUserSuccessfullReponseType = { id: Follow["followerId"] } & {
  ok: true;
};

export type FollowUserResponseType =
  ApiReturnDataInterface<FollowUserSuccessfullReponseType>;

export type UnfollowUserResponseType =
  ApiReturnDataInterface<FollowUserSuccessfullReponseType>;

export type FollowUserInput = z.infer<typeof followUserSchema>;
export type UnfollowUserInput = z.infer<typeof unfollowUserSchema>;
