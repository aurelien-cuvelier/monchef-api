import { fastify } from "fastify";
import { StatusCodes } from "http-status-codes";
import { duration } from "itty-time";
import { getAppPort } from "../config";
import { globalLogger } from "../logger";
import { LOGGER_CONFIG } from "../shared";
import { authHeadersSchemas } from "./auth.schemas";
import ingredientsRoutes from "./ingredients/ingredients.routes";
import metadataRoutes from "./metadata/metadata.routes";
import recipesRoutes from "./recipes/recipes.routes";
import { recipeSchemas } from "./recipes/recipes.schema";
import usersRoutes from "./users/users.routes";
import { userSchemas } from "./users/users.schema";

//For consistency purposes, EVERY PUBLIC endpoint should implement the same interface for responses
//This one complies with fastify generated errors

export type ApiReturnErrorInterface = {
  error: string;
  message?: string;
  statusCode: number;
};
export type ApiReturnDataInterface<T> = ApiReturnErrorInterface | T;

const STARTED_AT = Date.now();

const server = fastify({
  logger: LOGGER_CONFIG,
});

//Add schemas BEFORE register the route or it won't work

for (const schema of [
  ...userSchemas,
  ...recipeSchemas,
  ...authHeadersSchemas,
]) {
  server.addSchema(schema);
}

//All the different routes should be registered here
server.register(ingredientsRoutes, { prefix: "ingredients/" });
server.register(usersRoutes, { prefix: "users/" });
server.register(recipesRoutes, { prefix: "recipes/" });
server.register(metadataRoutes, { prefix: "metadata/" });

server.get("/healthcheck", async (_, reply) => {
  reply.code(StatusCodes.OK).send({
    info: `Running for ${duration(Date.now() - STARTED_AT)}`,
  });
});

export const startApp = async () => {
  try {
    await server.listen({ port: getAppPort(), host: "0.0.0.0" });
    await server.ready();
  } catch (e: unknown) {
    globalLogger.fatal(e, "Could not start app");
    process.exit(1);
  }
};
