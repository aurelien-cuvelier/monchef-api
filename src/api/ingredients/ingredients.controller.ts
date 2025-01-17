import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import { getIngredientsResponseType } from "./ingredients.schema";

export async function getIngredientsHandler(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<getIngredientsResponseType>;
  }>
) {
  try {
    const ingredients = await prisma.ingredient.findMany({
      select: {
        name: true,
        description: true,
        thumbnail: true,
      },
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
