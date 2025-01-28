import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import {
  GetIngredientsApiReponseType,
  ingredientsSelect,
} from "./ingredients.types";

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
