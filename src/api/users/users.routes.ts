import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { logRequestBody } from "../middlewares/requestLogging";
import { checkWalletSignature } from "../middlewares/walletSignature";
import {
  createUserHandler,
  editUserHandler,
  followUsersHandler,
  getUsersHandler,
  unfollowUsersHandler,
} from "./users.controller";
import { $ref } from "./users.schema";
import {
  CreateUserInput,
  CreateUserResponseType,
  EditUserInput,
  EditUserResponseType,
  FollowUserInput,
  FollowUserResponseType,
  GetUsersResponseType,
  UnfollowUserInput,
  UnfollowUserResponseType,
} from "./users.types";

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

  server.post<{
    Headers: requestWithAuthHeaders;
    Body: FollowUserInput;
    Reply: FollowUserResponseType;
  }>(
    "/follow",
    {
      schema: {
        body: $ref("followUserSchema"),
        headers: $authHeadersRef("headerWalletSignatureSchema"),
      },
      preHandler: [checkWalletSignature, logRequestBody],
    },

    followUsersHandler
  );

  server.post<{
    Headers: requestWithAuthHeaders;
    Body: UnfollowUserInput;
    Reply: UnfollowUserResponseType;
  }>(
    "/unfollow",
    {
      schema: {
        body: $ref("unfollowUserSchema"),
        headers: $authHeadersRef("headerWalletSignatureSchema"),
      },
      preHandler: [checkWalletSignature, logRequestBody],
    },

    unfollowUsersHandler
  );

  server.get<{ Reply: GetUsersResponseType }>(
    "/",
    {
      schema: {
        response: {
          "2xx": $ref("getUsersResponseSchema"),
        },
      },
    },
    getUsersHandler
  );
}
