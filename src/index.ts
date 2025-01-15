import "./config";
import { IS_PRODUCTION } from "./config";
import "./logger";
import { globalLogger } from "./logger";
import { prisma } from "./shared";

globalLogger.info(
  `New backend instance starting [IS_PRODUCTION: ${IS_PRODUCTION}]`
);

prisma.$queryRaw`SELECT NOW()`
  .then((r) => globalLogger.info(r))
  .catch((e) => globalLogger.error(e));
