import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const userCore = {
  username: z.string(),
  //address: z.string().refine((addr) => EVM_ADDRESS_REGEX.test(addr)),
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

//Currently data to edit is the same as for creation but partial
export const editUserSchema = z
  .object({
    ...userCore,
  })
  .partial();

//From now not including address in payloads as it creates friction for parsing
//They should be calculated from signatures

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    editUserSchema,
  },
  {
    $id: "userSchemas",
  }
);
