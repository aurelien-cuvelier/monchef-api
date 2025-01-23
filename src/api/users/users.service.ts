import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { globalLogger } from "../../logger";
import { prisma } from "../../shared";
import { CreateUserInput } from "./users.types";

export async function createUserInDb(
  input: CreateUserInput,
  address: Lowercase<string>
): Promise<
  { ok: true; id: number } | { ok: false; statusCode: number; error: string }
> {
  const functionName = createUserInDb.name;
  try {
    /***
     * @TODO implement this with OR in a single tx
     */

    const exists = await prisma.$transaction([
      prisma.user.findFirst({
        select: { id: true },
        where: {
          address,
        },
      }),
      prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          username: input.username,
        },
      }),
    ]);

    const alreadyExists = exists[0]?.id
      ? `Address`
      : exists?.[1]
      ? `Username`
      : null;

    if (alreadyExists) {
      return {
        ok: false,
        statusCode: StatusCodes.CONFLICT,
        error: `${alreadyExists} already in use!`,
      };
    }

    const created = await prisma.user.create({
      data: { ...input, address },
      select: {
        id: true,
      },
    });

    return { ok: true, id: created.id };
  } catch (e: unknown) {
    globalLogger.error(e, `${functionName} error in main`);
    return {
      ok: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    };
  }
}
