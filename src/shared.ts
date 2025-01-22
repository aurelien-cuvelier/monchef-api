import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { LoggerOptions } from "pino";
import * as genShortUUID from "short-uuid";

const BACKEND_ID = genShortUUID.generate();

export const prisma = new PrismaClient({
  log: ["info"],
});

export const axiosClient = axios;

export const LOGGER_CONFIG: LoggerOptions = {
  base: {
    backend_id: BACKEND_ID,
  },
  customLevels: {
    fatal: 80,
  },
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  },
};

export const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
