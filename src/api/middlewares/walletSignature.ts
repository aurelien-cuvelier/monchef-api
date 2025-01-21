import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Web3 } from "web3";
import { EVM_ADDRESS_REGEX, prisma } from "../../shared";
import {
  CreateRecipeInput,
  CreateRecipeResponseType,
} from "../recipes/recipes.schema";
import { CreateUserInput, CreateUserResponseType } from "../users/users.schema";
const determStringify = require("fast-json-stable-stringify");

const provider = new Web3(); //provider without RPC because we only wanna use local utils

export function checkWalletSignature(
  request: FastifyRequest<{
    Headers: { "x-wallet-signature": string };
    Body: CreateUserInput | CreateRecipeInput;
  }>,
  reply: FastifyReply<{ Reply: CreateUserResponseType }>,
  done: HookHandlerDoneFunction
) {
  const functionName = checkWalletSignature.name;
  try {
    //console.log(request.body);
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

export function validateAddressInBody(
  request: FastifyRequest<{
    Body: CreateUserInput | CreateRecipeInput;
  }>,
  reply: FastifyReply<{
    Reply: CreateRecipeResponseType | CreateUserResponseType;
  }>,
  done: HookHandlerDoneFunction
) {
  const functionName = validateAddressInBody.name;
  try {
    const match = EVM_ADDRESS_REGEX.test(request.body.address);

    if (!match) {
      reply.code(StatusCodes.BAD_REQUEST).send({
        error: ReasonPhrases.BAD_REQUEST,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid address!",
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

export async function checkThatUserExists(
  request: FastifyRequest<{
    Body: CreateUserInput | CreateRecipeInput;
  }>,
  reply: FastifyReply<{
    Reply: CreateRecipeResponseType | CreateUserResponseType;
  }>
  //done: HookHandlerDoneFunction
) {
  const functionName = checkWalletSignature.name;
  try {
    const address = request.body.address.toLowerCase();

    const exists = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        address: address,
      },
    });

    if (!exists) {
      reply.code(StatusCodes.NOT_FOUND).send({
        error: ReasonPhrases.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        message: "No user found with this address!",
      });
    }
  } catch (e: unknown) {
    request.log.error(e, `${functionName} error in main`);
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  // done();
}
