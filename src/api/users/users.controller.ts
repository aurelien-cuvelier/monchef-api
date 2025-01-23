import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import {
  createUserSchema,
} from "./users.schema";

import {
  CreateUserInput,
  CreateUserResponseType,
  GetUsersResponseType,
} from "./users.types";
import { createUserInDb } from "./users.service";

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: GetUsersResponseType;
  }>
) {
  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        avatar: true,
        bio: true,
        country_a3: true,
        twitter: true,
        discord: true,
        chef_rank: true,
        created_at: true,
        _count: {
          select: {
            recipes: true,
            reviews: true,
          },
        },
        recipes: {
          select: {
            id: true,
            name: true,
            overall_rating: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            reviewed_recipe: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return reply.code(StatusCodes.OK).send(users);
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<CreateUserResponseType>;
  }>
) {
  try {
    if (!request.address) {
      throw new Error(`Request NOT decorated with address!`);
    }

    request.body = createUserSchema.parse(request.body);
    const res = await createUserInDb(request.body, request.address);
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
