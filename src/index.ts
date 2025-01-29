import { startApp } from "./api/app";
import "./config";
import { IS_PRODUCTION } from "./config";
import "./logger";
import { globalLogger } from "./logger";
import { prisma } from "./shared";
import { initCountries } from "./utils/initCountries";
import { initIngredients } from "./utils/initIngredients";

const START_APP = true;
const START_MAIN = true;

globalLogger.info(
  `New backend instance starting [IS_PRODUCTION: ${IS_PRODUCTION}]`
);

//this won't pass tsc
const myNumber: number = "5";

if (START_APP) {
  startApp();
}

if (START_MAIN) {
  main();
}

async function main() {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    globalLogger.info("Database is reachable");
  } catch {
    globalLogger.error(
      "The database is not reachable, check the connection string!"
    );
  }

  try {
    const countIngredients = await prisma.ingredient.count();
    if (countIngredients === 0) {
      await initIngredients();
      globalLogger.info("Initialized ingredients in DB");
    }

    const countCountries = await prisma.country.count();
    if (countCountries === 0) {
      await initCountries();
      globalLogger.info("Initialized countries in DB");
    }
  } catch {
    globalLogger.error("The database has not been setup properly!");
  }
}
