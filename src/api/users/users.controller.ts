import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import { createUserSchema } from "./users.schema";

import { createUserInDb, editUserInDb } from "./users.service";
import {
  CreateUserInput,
  CreateUserResponseType,
  EditUserInput,
  EditUserResponseType,
  FollowUserInput,
  FollowUserResponseType,
  GetUsersResponseType,
  UnfollowUserInput,
  UnfollowUserResponseType,
  userSelect,
} from "./users.types";

export async function followUsersHandler(
  request: FastifyRequest<{
    Body: FollowUserInput;
  }>,
  reply: FastifyReply<{
    Reply: FollowUserResponseType;
  }>
) {
  try {
    if (!request.userId) {
      throw new Error(`Request NOT decorated with userId!`);
    }

    const alreadyExists = await prisma.follow.findUnique({
      select: {
        followerId: true,
        followingId: true,
      },
      where: {
        followerId_followingId: {
          followerId: request.userId,
          followingId: request.body.id,
        },
      },
    });

    if (!alreadyExists) {
      await prisma.follow.create({
        data: {
          followerId: request.userId,
          followingId: request.body.id,
        },
      });
    }

    return reply.code(StatusCodes.OK).send({ ok: true, id: request.userId });
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function unfollowUsersHandler(
  request: FastifyRequest<{
    Body: UnfollowUserInput;
  }>,
  reply: FastifyReply<{
    Reply: UnfollowUserResponseType;
  }>
) {
  try {
    if (!request.userId) {
      throw new Error(`Request NOT decorated with userId!`);
    }

    const exists = await prisma.follow.findUnique({
      select: {
        followerId: true,
        followingId: true,
      },
      where: {
        followerId_followingId: {
          followerId: request.userId,
          followingId: request.body.id,
        },
      },
    });

    if (exists) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: request.userId,
            followingId: request.body.id,
          },
        },
      });
    }

    return reply.code(StatusCodes.OK).send({ ok: true, id: request.userId });
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: GetUsersResponseType;
  }>
) {
  try {
    const users = await prisma.user.findMany({
      select: userSelect,
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

export async function editUserHandler(
  request: FastifyRequest<{ Body: EditUserInput }>,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<EditUserResponseType>;
  }>
) {
  try {
    if (!request.userId) {
      throw new Error(`Request NOT decorated with userId!`);
    }

    request.body = createUserSchema.parse(request.body);
    const res = await editUserInDb(request.body, request.userId);
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
