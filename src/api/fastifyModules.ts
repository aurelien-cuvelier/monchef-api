/**
 * This module is used to add the wallet address in the request after middleware verification
 */
declare module "fastify" {
  interface FastifyRequest {
    address: Lowercase<string> | null;
    userId: number | null;
  }
}
