import { FastifyRequest, FastifyReply } from "fastify";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { createReviewSchema } from "../reviews/reviews.schema";
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
    const { rating } = request.body;
    const { error: zodError } = createReviewSchema
      .omit({
        description: true,
        reviewedRecipeId: true,
      })
      .safeParse({ rating });

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
