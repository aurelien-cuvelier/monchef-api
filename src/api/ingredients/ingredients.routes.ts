import { FastifyInstance } from "fastify";
import { getIngredientsHandler } from "./ingredients.controller";
import { getIngredientsResponseType } from "./ingredients.schema";

export default async function ingredientsRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get<{ Reply: getIngredientsResponseType }>("/", getIngredientsHandler);
}
