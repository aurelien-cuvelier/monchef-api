import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const userCore = {
  username: z.string(),
  //address: z.string().refine((addr) => EVM_ADDRESS_REGEX.test(addr)),
  /**
   * @DEV altering methods (eg. transform) are NOT applied when fastify does its things
   */
  avatar: z.string().optional(),
  bio: z.string().optional(),
  country_a3: z.string().length(3), //alpha-3
  twitter: z.string().optional(),
  discord: z.string().optional(),
  /**
   * @BUG If a string is nullable and that null is received, Zod will serialize it to: ""
   * This will prevent the signature auth to work since the payload has been altered
   * For now to nullify a field the double quote emptry string "" should be used instead of null
   */
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
