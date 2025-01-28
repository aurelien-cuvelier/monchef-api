import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { globalLogger } from "../../logger";
import { prisma } from "../../shared";
import { CreateUserInput, EditUserInput } from "./users.types";

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

export async function editUserInDb(
  input: EditUserInput,
  userId: number
): Promise<
  { ok: true; id: number } | { ok: false; statusCode: number; error: string }
> {
  const functionName = createUserInDb.name;
  try {
    if (input.username) {
      const usernameTaken = await prisma.user.findFirst({
        select: {
          id: true,
          address: true,
        },
        where: {
          username: input.username,
        },
      });

      if (usernameTaken && usernameTaken?.id !== userId) {
        return {
          ok: false,
          statusCode: StatusCodes.CONFLICT,
          error: `Username already in use`,
        };
      }
    }

    const updated = await prisma.user.update({
      data: { ...input },
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    });

    return { ok: true, id: updated.id };
  } catch (e: unknown) {
    globalLogger.error(e, `${functionName} error in main`);
    return {
      ok: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    };
  }
}
