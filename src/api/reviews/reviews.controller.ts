import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import { CreateReviewInput } from "./reviews.types";
import { createReviewInDb } from "./reviews.service";
import {
  CreateReviewResponseType,
  GetReviewsResponseType,
  reviewSelect,
} from "./reviews.types";

export async function getReviewsHandler(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<GetReviewsResponseType>;
  }>
) {
  try {
    const reviews = await prisma.review.findMany({
      select: reviewSelect,
    });

    return reply.code(StatusCodes.OK).send(reviews);
  } catch (e: unknown) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function createReviewHandler(
  request: FastifyRequest<{ Body: CreateReviewInput }>,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<CreateReviewResponseType>;
  }>
) {
  try {
    if (!request.userId) {
      throw new Error(`Request NOT decorated with userId!`);
    }

    const res = await createReviewInDb(request.body, request.userId);
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
