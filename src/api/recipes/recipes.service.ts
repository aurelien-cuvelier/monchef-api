import { Prisma } from "@prisma/client";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { globalLogger } from "../../logger";
import { prisma } from "../../shared";
import { createUserInDb } from "../users/users.service";
import { CreateRecipeInput } from "./recipes.schema";

export async function createRecipeInDb(
  input: CreateRecipeInput,
  address: Lowercase<string>
): Promise<
  { ok: true; id: number } | { ok: false; statusCode: number; error: string }
> {
  const functionName = createUserInDb.name;
  try {
    /***
     * @TODO implement this with OR in a single tx
     */

    const user = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        address,
      },
    });

    if (!user) {
      //Should not be possible as middleware checks before coming here
      throw new Error(`User id not found`);
    }

    const exists = await prisma.recipe.findFirst({
      select: {
        id: true,
      },
      where: {
        name: input.name,
      },
    });

    if (exists) {
      return {
        ok: false,
        statusCode: StatusCodes.CONFLICT,
        error: "A recipe with this name alread exists!",
      };
    }

    const payload: Prisma.RecipeUncheckedCreateInput = {
      name: input.name,
      description: input.description,
      country_a3: input.country_a3,
      images: input.images,
      duration: input.duration,
      diffulty: input.diffulty,
      instructions: input.instructions,
      meal_role: input.meal_role,
      tags: input.tags,
      overall_rating: 0,
      created_by: user.id,
      items: {
        createMany: {
          data: input.items,
        },
      },
    };

    const created = await prisma.recipe.create({
      data: payload,
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
