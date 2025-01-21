import { Chef_ranks, Difficulty, Meal_type, Tags, Units } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { prisma } from "../../shared";
import { ApiReturnDataInterface } from "../app";
import { getMetadataResponseType } from "./metadata.schema";

export async function getMetadataHandler(
  request: FastifyRequest,
  reply: FastifyReply<{
    Reply: ApiReturnDataInterface<getMetadataResponseType>;
  }>
) {
  try {
    const countries = await prisma.country.findMany({
      select: {
        name: true,
        a3: true,
      },
    });

    const returnData: getMetadataResponseType = {
      tags: Object.keys(Tags) as Tags[],
      chefRanks: Object.keys(Chef_ranks) as Chef_ranks[],
      difficulty: Object.keys(Difficulty) as Difficulty[],
      units: Object.keys(Units) as Units[],
      mealType: Object.keys(Meal_type) as Meal_type[],
      countries,
    };

    return reply.code(StatusCodes.OK).send(returnData);
  } catch (e) {
    request.log.error(e);
    return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
