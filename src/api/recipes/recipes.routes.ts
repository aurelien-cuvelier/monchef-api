import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { parseAddress } from "../middlewares/customParsing";
import {
  checkThatUserExists,
  checkWalletSignature,
  validateAddressInBody,
} from "../middlewares/walletSignature";
import { createRecipeHandler } from "./recipes.controller";
import {
  $ref,
  CreateRecipeInput,
  CreateRecipeResponseType,
} from "./recipes.schema";

export default async function recipesRoutes(
  server: FastifyInstance
): Promise<void> {
  server.post<{
    Headers: requestWithAuthHeaders;
    Body: CreateRecipeInput;
    Reply: CreateRecipeResponseType;
  }>(
    "/create",
    {
      schema: {
        body: $ref("createRecipeSchema"),
        headers: $authHeadersRef("headerWalletSignatureSchema"),
      },
      preHandler: [
        validateAddressInBody,
        checkThatUserExists,
        checkWalletSignature,
        parseAddress,
      ],
    },
    createRecipeHandler
  );
}
