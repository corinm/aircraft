import * as dotenv from "dotenv";
import { connect } from "nats";

import { getAircraftData } from "./getAircraftData";
import { logger } from "./logger";

dotenv.config();

const TAR1090_URL = process.env.TAR1090_URL;
const HEXDB_API_URL = process.env.HEXDB_API_URL;

if (!TAR1090_URL) {
  logger.fatal('env var TAR1090_URL missing');
  process.exit(1);
}

if (!HEXDB_API_URL) {
  logger.fatal('env var HEXDB_API_URL missing');
  process.exit(1);
}

const main = async () => {
  logger.info('Starting up...')
  logger.info('Connecting to NATS...')
  const nc = await connect({ servers: ['nats://message-bus:4222'] });
  logger.info('Successfully connected to NATS')

  logger.info('Setting up interval')
  setInterval(() => getAircraftData(nc), 60_000);

  getAircraftData(nc);
};

main();
