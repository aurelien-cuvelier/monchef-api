import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const reviewCore = {
  rating: z
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "Value must be at most 5" })
    .refine((value) => (value * 2) % 1 === 0, {
      message: "Value must be a multiple of 0.5",
    }),
  reviewedRecipeId: z.number(),
  description: z.string().optional(),
};

export const createReviewSchema = z.object({
  ...reviewCore,
});

export const { schemas: reviewSchemas, $ref } = buildJsonSchemas(
  {
    createReviewSchema,
  },
  {
    $id: "reviewSchemas",
  }
);
