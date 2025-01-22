import { Prisma, Review } from "@prisma/client";
import z from "zod";
import { ApiReturnDataInterface } from "../app";
import { createReviewSchema } from "./reviews.schema";

export const reviewSelect = {
  id: true,
  description: true,
  rating: true,
  reviewed_recipe: {
    select: {
      id: true,
      name: true,
    },
  },
  reviewer: {
    select: {
      id: true,
      username: true,
    },
  },
};

export type GetReviewsSuccessfulResponseType = Prisma.ReviewGetPayload<{
  select: typeof reviewSelect;
}>[];

export type GetReviewsResponseType =
  ApiReturnDataInterface<GetReviewsSuccessfulResponseType>;

export type CreateReviewSuccessfullResponseType = { id: Review["id"] } & {
  ok: true;
};

export type CreateReviewResponseType =
  ApiReturnDataInterface<CreateReviewSuccessfullResponseType>;

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
