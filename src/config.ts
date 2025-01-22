require("dotenv").config();

import { globalLogger } from "./logger";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

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
  getAppPort();
})();

export function getDatabaseUrl(): string {
  //Input another key for dev if needed
  const dbEnvKey = IS_PRODUCTION ? "DATABASE_URL" : "DATABASE_URL";
  const val = IS_PRODUCTION ? process.env[dbEnvKey] : process.env[dbEnvKey];

  if (!val) {
    globalLogger.fatal(`Missing ${dbEnvKey} in ENV!`);
    process.exit(1);
  }

  return val;
}

export function getAppPort(): number {
  const val = process.env.APP_PORT;

  if (!val || isNaN(Number(val))) {
    globalLogger.fatal(`Missing APP_PORT in ENV!`);
    process.exit(1);
  }

  return Number(val);
}
