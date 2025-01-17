import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { globalLogger } from "../../logger";
import { prisma } from "../../shared";
import { CreateUserInput } from "./users.schema";

export async function createUserInDb(
  input: CreateUserInput
): Promise<
  { ok: true; id: number } | { ok: false; statusCode: number; error: string }
> {
  const functionName = createUserInDb.name;
  try {
    const created = await prisma.user.create({
      data: input,
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
