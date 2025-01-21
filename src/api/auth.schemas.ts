import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const headerWalletSignature = {
  "x-wallet-signature": z.string().length(132),
};

const headerWalletSignatureSchema = z.object({
  ...headerWalletSignature,
});

export type requestWithAuthHeaders = z.infer<
  typeof headerWalletSignatureSchema
>;

export const { schemas: authHeadersSchemas, $ref: $authHeadersRef } =
  buildJsonSchemas(
    {
      headerWalletSignatureSchema,
    },
    {
      $id: "authHeadersSchemas",
    }
  );
