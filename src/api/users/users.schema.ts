import { User } from "@prisma/client";
import { buildJsonSchemas } from "fastify-zod";
import z from "zod";
import { EVM_ADDRESS_REGEX } from "../../shared";
import { ApiReturnDataInterface } from "../app";

export type CreateUserResponseType = ApiReturnDataInterface<
  { id: User["id"] } & { ok: true }
>;

export type getUserResponseType = ApiReturnDataInterface<
  Omit<User, "created_at" | "updated_at">
>;

const userCore = {
  username: z.string(),
  address: z.string().refine((addr) => EVM_ADDRESS_REGEX.test(addr)), //Currently not validating any format
  avatar: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().length(3), //alpha-3
  twitter: z.string().optional(),
  discord: z.string().optional(),
  //chef_rank: $Enums.Chef_ranks;
};

const createUserSchema = z.object({
  ...userCore,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
});
