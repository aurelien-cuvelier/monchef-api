import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { checkReviewRating } from "../middlewares/checkReviewRating";
import { checkWalletSignature } from "../middlewares/walletSignature";
import { createReviewHandler, getReviewsHandler } from "./reviews.controller";
import { $ref } from "./reviews.schema";
import {
  CreateReviewInput,
  CreateReviewResponseType,
  GetReviewsResponseType,
} from "./reviews.types";

export default async function reviewsRoutes(
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
      preHandler: [checkWalletSignature, checkReviewRating],
    },

    createReviewHandler
  );

  server.get<{ Reply: GetReviewsResponseType }>("/", getReviewsHandler);
}
