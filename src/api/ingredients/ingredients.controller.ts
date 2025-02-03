import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { globalLogger } from "../../logger";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import {
  CreateIngredientApiReponseType,
  CreateIngredientInput,
  GetIngredientsApiReponseType,
  ingredientsSelect,
} from "./ingredients.types";

export async function createNewIngredientHandler(
  request: FastifyRequest<{ Body: CreateIngredientInput }>,
  reply: FastifyReply<{ Reply: CreateIngredientApiReponseType }>
) {
  try {
    if (!request.userId) {
      throw new Error(`Request NOT decorated with address!`);
    }

    const nameExists = await prisma.ingredient.findUnique({
      select: { id: true },
      where: {
        name: request.body.name,
      },
    });

    if (nameExists) {
      return reply.code(StatusCodes.CONFLICT).send({
        error: "Ingredient name already used!",
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const created = await prisma.ingredient.create({
      data: {
        name: request.body.name,
        description: request.body.description,
        created_by_user_id: request.userId,
      },
      select: {
        id: true,
      },
    });

    globalLogger.info(
      `User #${request.userId} created ingredient #${created.id}: ${request.body.name}`
    );

    return reply.code(StatusCodes.OK).send({ ok: true, id: created.id });
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
export async function getIngredientsHandler(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<GetIngredientsApiReponseType>;
  }>
) {
  try {
    const ingredients = await prisma.ingredient.findMany({
      select: ingredientsSelect,
    });

    return reply.code(StatusCodes.OK).send(ingredients);
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
