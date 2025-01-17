import { FastifyInstance } from "fastify";
import { createUserHandler } from "./users.controller";
import { $ref, CreateUserInput, CreateUserResponseType } from "./users.schema";

export default async function usersRoutes(
  server: FastifyInstance
): Promise<void> {
  server.post<{ Body: CreateUserInput; Reply: CreateUserResponseType }>(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
      },
    },
    createUserHandler
  );
}
