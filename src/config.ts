require("dotenv").config();

import { globalLogger } from "./logger";

export const IS_PRODUCTION = process.env.NODE_ENV !== "production";

export function getDatabaseUrl(): string {
  const val = process.env.DATABASE_URL;

  if (!val) {
    globalLogger.fatal("Missing DATABASE_URL in ENV!");
    process.exit(1);
  }

  return val;
}
