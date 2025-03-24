import pino from "pino";

export const logger = pino({ "name": "aircraft.discovery", "level": "info" })
