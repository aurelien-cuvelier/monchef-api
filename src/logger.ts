import pino from "pino";
import * as genShortUUID from "short-uuid";

const backend_id = genShortUUID.generate();

export const globalLogger = pino({
  base: {
    backend_id,
  },
  customLevels: {
    fatal: 80,
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});
