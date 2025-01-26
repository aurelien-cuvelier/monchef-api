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
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        params: req.params,
        ["x-wallet-signature"]: req.headers["x-wallet-signature"],
        host: req.host,
        remoteAddress: req.ip,
        remotePort: req.socket.remotePort,
      };
    },
    res(reply) {
      return {
        statusCode: reply.statusCode,
      };
    },
  },
};

export const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
