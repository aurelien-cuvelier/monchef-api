import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { globalLogger } from "../logger";
import { prisma } from "../shared";

export async function updateRecipeRating(
  recipeId: number
): Promise<
  { ok: true; id: number } | { ok: false; statusCode: number; error: string }
> {
  const functionName = updateRecipeRating.name;
  try {
    const recipe = await prisma.recipe.findUnique({
      select: {
        id: true,
        overall_rating: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      return {
        ok: false,
        statusCode: StatusCodes.NOT_FOUND,
        error: ReasonPhrases.NOT_FOUND,
      };
    }

    let newRating = 0;

    for (const review of recipe.reviews) {
      newRating += review.rating;
    }

    newRating /= recipe.reviews.length;
    const formattedNewRating = Number(newRating.toFixed(2));

    await prisma.recipe.update({
      data: {
        overall_rating: formattedNewRating,
      },
      where: {
        id: recipe.id,
      },
    });

    globalLogger.info(
      `recipe #${recipe.id} rating update ${recipe.overall_rating} => ${formattedNewRating} (${recipe.reviews.length} reviews)`
    );

    return { ok: true, id: recipe.id };
  } catch (e: unknown) {
    globalLogger.error(e, `${functionName} error in main`);
    return {
      ok: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    };
  }
}
