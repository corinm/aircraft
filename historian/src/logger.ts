import pino from "pino";

export const logger = pino({ "name": "aircraft.historian", "level": "info" })