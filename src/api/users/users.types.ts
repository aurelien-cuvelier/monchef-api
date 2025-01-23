import { Prisma, User } from "@prisma/client";
import z from "zod";
import { ApiReturnDataInterface } from "../app";
import { createUserSchema } from "./users.schema";

export const userSelect = {
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
