import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { checkWalletSignature } from "../middlewares/walletSignature";
import {
  createUserHandler,
  editUserHandler,
  getUsersHandler,
} from "./users.controller";
import { $ref } from "./users.schema";
import {
  CreateUserInput,
  CreateUserResponseType,
  EditUserInput,
  EditUserResponseType,
  GetUsersResponseType,
} from "./users.types";
import { logRequestBody } from "../middlewares/requestLogging";

export default async function usersRoutes(
  server: FastifyInstance
): Promise<void> {
  server.decorateRequest("address", null);
  server.decorateRequest("userId", null);
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
      preHandler: [checkWalletSignature, logRequestBody],
    },

    createUserHandler
  );

  server.post<{
    Headers: requestWithAuthHeaders;
    Body: EditUserInput;
    Reply: EditUserResponseType;
  }>(
    "/edit",
    {
      schema: {
        body: $ref("editUserSchema"),
        headers: $authHeadersRef("headerWalletSignatureSchema"),
      },
      preHandler: [checkWalletSignature, logRequestBody],
    },

    editUserHandler
  );

  server.get<{ Reply: GetUsersResponseType }>("/", getUsersHandler);
}
