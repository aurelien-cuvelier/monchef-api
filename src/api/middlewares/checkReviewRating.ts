import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import z from "zod";
import { CreateReviewInput } from "../reviews/reviews.types";
import { CreateUserResponseType } from "../users/users.types";
import { checkWalletSignature } from "./walletSignature";

export async function checkReviewRating(
  request: FastifyRequest<{
    Body: CreateReviewInput;
  }>,
  reply: FastifyReply<{ Reply: CreateUserResponseType }>
) {
  const functionName = checkWalletSignature.name;
  try {
    /**
     * @DEV
     * We don't use the createReviewSchema zod object here because it is define by an ext. lib
     * Therefore we would need to re-write everytime this refined type after each generation
     */
    const { rating } = request.body;
    const { error: zodError } = z
      .number()
      .min(1, { message: "Value must be at least 1" })
      .max(5, { message: "Value must be at most 5" })
      .refine((value) => (value * 2) % 1 === 0, {
        message: "Value must be a multiple of 0.5",
      })
      .safeParse(rating);

    if (zodError) {
      reply.code(StatusCodes.BAD_REQUEST).send({
        error: `${zodError.errors[0].path[0]}: ${zodError.errors[0].message}`,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
  } catch (e: unknown) {
    request.log.error(e, `${functionName} error in main`);
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
