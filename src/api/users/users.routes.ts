import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { checkWalletSignature } from "../middlewares/walletSignature";
import { createUserHandler, getUsersHandler } from "./users.controller";
import {
  $ref,
  CreateUserInput,
  CreateUserResponseType,
  GetUsersResponseType,
} from "./users.schema";

export default async function usersRoutes(
  server: FastifyInstance
): Promise<void> {
  server.decorateRequest("address", null);
  server.post<{
    Headers: requestWithAuthHeaders;
    Body: CreateUserInput;
    Reply: CreateUserResponseType;
  }>(
    "/create",
    {
      schema: {
        body: $ref("createUserSchema"),
        headers: $authHeadersRef("headerWalletSignatureSchema"),
      },
      preHandler: [checkWalletSignature],
    },

    createUserHandler
  );

  server.get<{ Reply: GetUsersResponseType }>("/", getUsersHandler);
}
