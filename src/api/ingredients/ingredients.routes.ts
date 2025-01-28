import { FastifyInstance } from "fastify";
import { getIngredientsHandler } from "./ingredients.controller";
import { GetIngredientsApiReponseType } from "./ingredients.types";
import { $ref } from "./ingredients.schema";

export default async function ingredientsRoutes(
  server: FastifyInstance
): Promise<void> {
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
}
