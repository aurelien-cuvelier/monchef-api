import { FastifyInstance } from "fastify";
import { getMetadataHandler } from "./metadata.controller";
import { getMetadataResponseType } from "./metadata.schema";

export default async function metadataRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get<{ Reply: getMetadataResponseType }>("/", getMetadataHandler);
}
