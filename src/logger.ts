import pino from "pino";
import { LOGGER_CONFIG } from "./shared";



export const globalLogger = pino(LOGGER_CONFIG);
