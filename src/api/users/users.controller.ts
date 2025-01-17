import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ApiReturnDataInterface } from "../app";
import { CreateUserInput, CreateUserResponseType } from "./users.schema";
import { createUserInDb } from "./users.service";

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<CreateUserResponseType>;
  }>
) {
  try {
    const res = await createUserInDb(request.body);

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
