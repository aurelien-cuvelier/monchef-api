import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Web3 } from "web3";
import { CreateUserInput, CreateUserResponseType } from "../users/users.schema";
const determStringify = require("fast-json-stable-stringify");

const provider = new Web3(); //provider without RPC because we only wanna use local utils

export function checkWalletSignature(
  request: FastifyRequest<{
    Headers: { "x-wallet-signature": string };
    Body: CreateUserInput;
  }>,
  reply: FastifyReply<{ Reply: CreateUserResponseType }>,
  done: HookHandlerDoneFunction
) {
  const functionName = checkWalletSignature.name;
  try {
    const address = request.body.address.toLowerCase();
    const hashedPayload = provider.utils.sha3(determStringify(request.body));

    if (!hashedPayload) {
      throw new Error(`hashing failed`);
    }

    const recoveredAddress: Lowercase<string> = provider.eth.accounts
      .recover(hashedPayload, request.headers["x-wallet-signature"])
      .toLowerCase() as Lowercase<string>;

    if (address !== recoveredAddress) {
      reply.code(StatusCodes.FORBIDDEN).send({
        error: ReasonPhrases.FORBIDDEN,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Signature does not match!",
      });
    }
  } catch (e: unknown) {
    request.log.error(e, `${functionName} error in main`);
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  done();
}
