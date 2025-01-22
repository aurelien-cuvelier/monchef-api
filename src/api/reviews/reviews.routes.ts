import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { checkWalletSignature } from "../middlewares/walletSignature";
import { createReviewHandler, getReviewsHandler } from "./reviews.controller";
import {CreateReviewInput} from "./reviews.types"
import { $ref,  } from "./reviews.schema";
import {
  CreateReviewResponseType,
  GetReviewsResponseType,
} from "./reviews.types";

export default async function usersRoutes(
  server: FastifyInstance
): Promise<void> {
  server.decorateRequest("address", null);
  server.post<{
    Headers: requestWithAuthHeaders;
    Body: CreateReviewInput;
    Reply: CreateReviewResponseType;
  }>(
    "/create",
    {
      schema: {
        body: $ref("createReviewSchema"),
        headers: $authHeadersRef("headerWalletSignatureSchema"),
      },
      preHandler: [checkWalletSignature],
    },

    createReviewHandler
  );

  server.get<{ Reply: GetReviewsResponseType }>("/", getReviewsHandler);
}
