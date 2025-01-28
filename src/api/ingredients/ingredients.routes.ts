import { FastifyInstance } from "fastify";
import { getIngredientsHandler } from "./ingredients.controller";
import { GetIngredientsApiReponseType } from "./ingredients.types";

export default async function ingredientsRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get<{ Reply: GetIngredientsApiReponseType }>(
    "/",
    getIngredientsHandler
  );
}
