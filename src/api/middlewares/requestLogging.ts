import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export function logRequestBody(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  if (request.body) {
    request.log.info(
      { body: request.body, address: request.address, userId: request.userId },
      "request body"
    );
  }

  done();
}
