import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { checkWalletSignature } from "../middlewares/walletSignature";
import { createRecipeHandler, getRecipesHandler } from "./recipes.controller";
import {
  $ref,
  CreateRecipeInput,
  CreateRecipeResponseType,
  getRecipesResponseType,
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
      preHandler: [checkWalletSignature],
    },
    createRecipeHandler
  );

  server.get<{ Reply: getRecipesResponseType }>("/", getRecipesHandler);
}
