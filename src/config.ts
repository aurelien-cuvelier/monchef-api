require("dotenv").config();

import { globalLogger } from "./logger";

export const IS_PRODUCTION = process.env.NODE_ENV !== "production";

/**
 * This file is the only file where process.env shoud be used. Each env variable should have a getter function here
 * that will exit the process if it is required for normal work. This prevents deployment to production if the
 * container's env is not up to date.
 */

(() => {
  if (IS_PRODUCTION) {
    //env var not needed for dev
  }

  getDatabaseUrl();
})();

export function getDatabaseUrl(): string {
  const val = process.env.DATABASE_URL;

  if (!val) {
    globalLogger.fatal("Missing DATABASE_URL in ENV!");
    process.exit(1);
  }

  return val;
}
