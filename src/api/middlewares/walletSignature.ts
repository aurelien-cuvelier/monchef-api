import { FastifyReply, FastifyRequest } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Web3 } from "web3";
import { prisma } from "../../shared";
import { CreateRecipeInput } from "../recipes/recipes.types";
import { CreateReviewInput } from "../reviews/reviews.types";
import { CreateUserInput, CreateUserResponseType } from "../users/users.types";
const determStringify = require("fast-json-stable-stringify");

const provider = new Web3(); //provider without RPC because we only wanna use local utils

export async function checkWalletSignature(
  request: FastifyRequest<{
    Headers: { "x-wallet-signature": string };
    Body: CreateUserInput | CreateRecipeInput | CreateReviewInput;
  }>,
  reply: FastifyReply<{ Reply: CreateUserResponseType }>
) {
  const functionName = checkWalletSignature.name;
  try {
    const hashedPayload = provider.utils.sha3(determStringify(request.body));

    if (!hashedPayload) {
      throw new Error(`hashing failed`);
    }

    const recoveredAddressLowerCase: Lowercase<string> = provider.eth.accounts
      .recover(hashedPayload, request.headers["x-wallet-signature"])
      .toLowerCase() as Lowercase<string>;

    if (request.url !== "/users/create") {
      //We skip this ONLY when creating a new user
      const foundUser = await prisma.user.findUnique({
        select: {
          id: true,
          address: true,
        },
        where: {
          address: recoveredAddressLowerCase,
        },
      });
      //If no user is found with this address, then we assume
      if (!foundUser) {
        reply.code(StatusCodes.FORBIDDEN).send({
          error: ReasonPhrases.FORBIDDEN,
          statusCode: StatusCodes.FORBIDDEN,
          message: "Signature matching no user!",
        });
      }

      request.userId = foundUser?.id || null;
    }

    request.address = recoveredAddressLowerCase;
  } catch (e: unknown) {
    request.log.error(e, `${functionName} error in main`);
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
