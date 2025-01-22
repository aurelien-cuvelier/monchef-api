import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  CreateRecipeInput,
  CreateRecipeResponseType,
} from "../recipes/recipes.schema";
import { CreateUserInput, CreateUserResponseType } from "../users/users.schema";

// export function parseAddress(
//   request: FastifyRequest<{
//     Body: CreateUserInput | CreateRecipeInput;
//   }>,
//   reply: FastifyReply<{
//     Reply: CreateRecipeResponseType | CreateUserResponseType;
//   }>,
//   done: HookHandlerDoneFunction
// ) {
//   const functionName = parseAddress.name;
//   try {
//     request.body.address = request.body.address.toLowerCase();
//   } catch (e: unknown) {
//     request.log.error(e, `${functionName} error in main`);
//     reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
//       error: ReasonPhrases.INTERNAL_SERVER_ERROR,
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//     });
//   }

//   done();
// }
