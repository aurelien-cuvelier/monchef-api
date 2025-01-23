import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import { createRecipeSchema } from "./recipes.schema";

import {
  CreateRecipeInput,
  CreateRecipeResponseType,
  GetRecipesResponseType,
} from "./recipes.types";

import { createRecipeInDb } from "./recipes.service";
import { recipeSelect } from "./recipes.types";

export async function getRecipesHandler(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: GetRecipesResponseType;
  }>
) {
  try {
    const recipes = await prisma.recipe.findMany({
      select: recipeSelect,
    });

    return reply.code(StatusCodes.OK).send(recipes);
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function createRecipeHandler(
  request: FastifyRequest<{ Body: CreateRecipeInput }>,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<CreateRecipeResponseType>;
  }>
) {
  try {
    if (!request.address) {
      throw new Error(`Request NOT decorated with address!`);
    }

    request.body = createRecipeSchema.parse(request.body);

    const res = await createRecipeInDb(request.body, request.address);

    const { ok } = res;

    if (!ok) {
      return reply
        .code(res.statusCode)
        .send({ error: res.error, statusCode: res.statusCode });
    }

    return reply.code(StatusCodes.OK).send({ id: res.id, ok });
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
