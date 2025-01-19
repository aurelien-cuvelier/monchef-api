import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ApiReturnDataInterface } from "../app";
import {
  CreateRecipeInput,
  CreateRecipeResponseType,
  createRecipeSchema,
} from "./recipes.schema";
import { createRecipeInDb } from "./recipes.service";

export async function createRecipeHandler(
  request: FastifyRequest<{ Body: CreateRecipeInput }>,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<CreateRecipeResponseType>;
  }>
) {
  try {
    request.body = createRecipeSchema.parse(request.body);

    const res = await createRecipeInDb(request.body);

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
