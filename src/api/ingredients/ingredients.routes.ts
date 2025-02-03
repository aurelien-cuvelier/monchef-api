import { FastifyInstance } from "fastify";
import { $authHeadersRef, requestWithAuthHeaders } from "../auth.schemas";
import { logRequestBody } from "../middlewares/requestLogging";
import { checkWalletSignature } from "../middlewares/walletSignature";
import {
  createNewIngredientHandler,
  getIngredientsHandler,
} from "./ingredients.controller";
import { $ref } from "./ingredients.schema";
import {
  CreateIngredientApiReponseType,
  CreateIngredientInput,
  GetIngredientsApiReponseType,
} from "./ingredients.types";

export default async function ingredientsRoutes(
  server: FastifyInstance
): Promise<void> {
  server.decorateRequest("address", null);
  server.decorateRequest("userId", null);

  server.get<{ Reply: GetIngredientsApiReponseType }>(
    "/",

    {
      schema: {
        response: {
          "200": $ref("getIngredientsResponseSchema"),
        },
      },
    },
    getIngredientsHandler
  );

  server.post<{
    Body: CreateIngredientInput;
    Reply: CreateIngredientApiReponseType;
    Headers: requestWithAuthHeaders;
  }>(
    "/create",
    {
      schema: {
        body: $ref("createIngredientSchema"),
        headers: $authHeadersRef("headerWalletSignatureSchema"),
        response: {
          "200": $ref("createIngredientResponseSchema"),
        },
      },
      preHandler: [checkWalletSignature, logRequestBody],
    },
    createNewIngredientHandler
  );
}
