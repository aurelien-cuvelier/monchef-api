import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { globalLogger } from "../../logger";
import { prisma } from "../../shared";
import { CreateReviewInput } from "./reviews.types";

export async function createReviewInDb(
  input: CreateReviewInput,
  userId: number
): Promise<
  { ok: true; id: number } | { ok: false; statusCode: number; error: string }
> {
  const functionName = createReviewInDb.name;
  try {
    const recipe = await prisma.recipe.findFirst({
      select: {
        id: true,
        reviews: {
          select: {
            id: true,
            reviewed_by_user_id: true,
          },
          where: {
            reviewed_by_user_id: userId,
          },
        },
      },
      where: {
        id: input.reviewedRecipeId,
      },
    });

    if (!recipe) {
      return {
        ok: false,
        statusCode: StatusCodes.NOT_FOUND,
        error: `Recipe id ${input.reviewedRecipeId} not found`,
      };
    }

    if (recipe.reviews.length) {
      return {
        ok: false,
        statusCode: StatusCodes.CONFLICT,
        error: `User already reviewed this recipe`,
      };
    }

    const created = await prisma.review.create({
      data: {
        title: input.title,
        rating: input.rating,
        description: input.description,
        reviewed_recipe_id: input.reviewedRecipeId,
        reviewed_by_user_id: userId,
      },
      select: {
        id: true,
      },
    });

    return { ok: true, id: created.id };
  } catch (e: unknown) {
    globalLogger.error(e, `${functionName} error in main`);
    return {
      ok: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    };
  }
}
