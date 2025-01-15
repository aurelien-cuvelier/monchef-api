import "./config";
import { IS_PRODUCTION } from "./config";
import "./logger";
import { globalLogger } from "./logger";

globalLogger.info(
  `New backend instance starting [IS_PRODUCTION: ${IS_PRODUCTION}]`
);
