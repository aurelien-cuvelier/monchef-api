import { FastifyInstance, FastifyRequest } from "fastify";
import { checkWalletSignature } from "../middlewares/walletSignature";
import { createUserHandler } from "./users.controller";
import {
  $ref,
  CreateUserInput,
  CreateUserResponseType,
  createUserSchema,
} from "./users.schema";

const usersRouteAuthHeaders = {
  headers: $ref("headerWalletSignatureSchema"),
};

export default async function usersRoutes(
  server: FastifyInstance
): Promise<void> {
  server.post<{
    Headers: {
      "x-wallet-signature": string;
    };
    Body: CreateUserInput;
    Reply: CreateUserResponseType;
  }>(
    "/create",
    {
      schema: {
        body: $ref("createUserSchema"),
        ...usersRouteAuthHeaders,
      },
      preHandler: [
        checkWalletSignature,
        (request: FastifyRequest<{ Body: CreateUserInput }>, _, done) => {
          /**
           * @TODO gotta do this better
           */
          request.body = createUserSchema.parse(request.body);
          done();
        },
      ],
    },

    createUserHandler
  );
}
