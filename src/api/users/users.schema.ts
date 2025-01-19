import { User } from "@prisma/client";
import { buildJsonSchemas } from "fastify-zod";
import z from "zod";
import {
  ApiReturnDataInterface,
  headerWalletSignatureSchema,
  zodAddress,
} from "../app";

export type CreateUserResponseType = ApiReturnDataInterface<
  { id: User["id"] } & { ok: true }
>;

export type getUserResponseType = ApiReturnDataInterface<
  Omit<User, "created_at" | "updated_at">
>;

const userCore = {
  username: z.string(),
  ...zodAddress,

  /**
   * @DEV altering methods (eg. transform) are NOT applied when fastify does its things
   * @TODO gotta find a clean way to do this AFTER checking auth or it will modify the payload
   */
  avatar: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().length(3), //alpha-3
  twitter: z.string().optional(),
  discord: z.string().optional(),
};

export const createUserSchema = z.object({
  ...userCore,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  headerWalletSignatureSchema,
});
