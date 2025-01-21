import { User } from "@prisma/client";
import { buildJsonSchemas } from "fastify-zod";
import z from "zod";
import { EVM_ADDRESS_REGEX } from "../../shared";
import { ApiReturnDataInterface } from "../app";

export type CreateUserSuccessfullResponseType = { id: User["id"] } & {
  ok: true;
};

export type CreateUserResponseType =
  ApiReturnDataInterface<CreateUserSuccessfullResponseType>;

export type getUserResponseType = ApiReturnDataInterface<
  Omit<User, "created_at" | "updated_at">
>;

const userCore = {
  username: z.string(),
  address: z.string().refine((addr) => EVM_ADDRESS_REGEX.test(addr)),
  /**
   * @DEV altering methods (eg. transform) are NOT applied when fastify does its things
   * @TODO gotta find a clean way to do this AFTER checking auth or it will modify the payload
   */
  avatar: z.string().optional(),
  bio: z.string().optional(),
  country_a3: z.string().length(3), //alpha-3
  twitter: z.string().optional(),
  discord: z.string().optional(),
};

export const createUserSchema = z.object({
  ...userCore,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
  },
  {
    $id: "userSchemas",
  }
);
