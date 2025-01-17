import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { globalLogger } from "../logger";
import { axiosClient, prisma } from "../shared";

interface IngredientResponse {
  meals: {
    strIngredient: string;
    strDescription: string | null;
  }[];
}

/**
 * As a start, we use the ingredient list from themealdb.com to feed our own database, it contains ~600 items
 */

export async function initIngredients(): Promise<void> {
  const functionName = initIngredients.name;
  try {
    const res = await axiosClient.get<IngredientResponse>(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );

    if (res.status !== StatusCodes.OK) {
      throw new Error(`Status code: ${res.status}`);
    }

    const createManyIngredientPayload: Prisma.IngredientCreateInput[] =
      res.data.meals.map((ingredient) => {
        return {
          name: ingredient.strIngredient,
          description: ingredient.strDescription || undefined,
        };
      });

    await prisma.ingredient.createMany({
      data: createManyIngredientPayload,
    });

    globalLogger.info(`${functionName} Done!`);
  } catch (e: unknown) {
    globalLogger.error(e, `${functionName} error in main`);
  }

  return;
}
