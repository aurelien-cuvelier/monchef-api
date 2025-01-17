import { fastify } from "fastify";
import { StatusCodes } from "http-status-codes";
import { duration } from "itty-time";
import { getAppPort } from "../config";
import { globalLogger } from "../logger";
import { LOGGER_CONFIG } from "../shared";

const STARTED_AT = Date.now();

const server = fastify({
  logger: LOGGER_CONFIG,
});

server.get("/healthcheck", async (_, reply) => {
  reply.code(StatusCodes.OK).send({
    info: `Running for ${duration(Date.now() - STARTED_AT)}`,
  });
});

export const startApp = async () => {
  try {
    await server.listen({ port: getAppPort(), host: "0.0.0.0" });
  } catch (e: unknown) {
    globalLogger.fatal(e, "Could not start app");
    process.exit(1);
  }
};
