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
  const dbEnvKey = IS_PRODUCTION ? "DATABASE_URL" : "DATABASE_URL_DEV";
  const val = IS_PRODUCTION ? process.env[dbEnvKey] : process.env[dbEnvKey];

  if (!val) {
    globalLogger.fatal(`Missing ${dbEnvKey} in ENV!`);
    process.exit(1);
  }

  return val;
}
