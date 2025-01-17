import { Prisma } from "@prisma/client";
import { globalLogger } from "../logger";
import countryFile from "../misc/countries-iso-3166.json";
import { prisma } from "../shared";

export async function initCountries(): Promise<void> {
  const functionName = initCountries.name;
  try {
    const createManyCountriesPayload: Prisma.CountryCreateInput[] =
      countryFile.map((country) => {
        return {
          name: country.name,
          a2: country["alpha-2"],
          a3: country["alpha-3"],
        };
      });

    await prisma.country.createMany({
      data: createManyCountriesPayload,
    });

    globalLogger.info(`${functionName} Done!`);
  } catch (e: unknown) {
    globalLogger.error(e, `${functionName} error in main`);
  }
}
