import { FastifyInstance, FastifyRequest } from "fastify";
import {
  checkThatUserExists,
  checkWalletSignature,
} from "../middlewares/walletSignature";
import { createRecipeHandler } from "./recipes.controller";
import {
  $ref,
  CreateRecipeInput,
  CreateRecipeResponseType,
  createRecipeSchema,
} from "./recipes.schema";

const recipeRouteAuthHeaders = {
  headers: $ref("headerWalletSignatureSchema"),
};

export default async function recipesRoutes(
  server: FastifyInstance
): Promise<void> {
  server.post<{
    Headers: {
      "x-wallet-signature": string;
    };
    Body: CreateRecipeInput;
    Reply: CreateRecipeResponseType;
  }>(
    "/create",
    {
      schema: {
        body: $ref("createRecipeSchema"),
        ...recipeRouteAuthHeaders,
      },
      preHandler: [
        checkThatUserExists,
        checkWalletSignature,
        (request: FastifyRequest<{ Body: CreateRecipeInput }>, _, done) => {
          /**
           * @TODO gotta do this better
           */
          request.body = createRecipeSchema.parse(request.body);
          done();
        },
      ],
    },
    createRecipeHandler
  );
}
