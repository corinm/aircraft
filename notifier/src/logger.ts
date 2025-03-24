import pino from "pino";

export const logger = pino({ "name": "aircraft.notifier", "level": "info" })