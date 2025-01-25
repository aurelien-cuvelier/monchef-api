import { startApp } from "./api/app";
import "./config";
import { IS_PRODUCTION } from "./config";
import "./logger";
import { globalLogger } from "./logger";
import { prisma } from "./shared";
import { initCountries } from "./utils/initCountries";
import { initIngredients } from "./utils/initIngredients";

const START_APP = true;
const START_MAIN = false;

//won't build
const hello: string = 55;

globalLogger.info(
  `New backend instance starting [IS_PRODUCTION: ${IS_PRODUCTION}]`
);

prisma.$queryRaw`SELECT NOW()`
  .then((r) => globalLogger.info(r))
  .catch((e) => globalLogger.error(e));

if (START_APP) {
  startApp();
}

if (START_MAIN) {
  main();
}

async function main() {
  await initIngredients();
  await initCountries();
}
