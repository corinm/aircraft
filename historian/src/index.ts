import * as dotenv from "dotenv";
import { connect, StringCodec } from "nats";

import { logger } from "./logger";
import { EnrichedAircraft } from "./Aircraft";
import { onAircraft } from "./onAircraft";

dotenv.config();

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

if (!MONGODB_USER) {
  logger.fatal('env var MONGODB_USER missing');
  process.exit(1);
}

if (!MONGODB_PASSWORD) {
  logger.fatal('env var MONGODB_PASSWORD missing');
  process.exit(1);
}

const main = async () => {
  logger.info('Starting up...')
  logger.info('Connecting to NATS...')
  const nc = await connect({ servers: ['nats://message-bus:4222'] });
  logger.info('Successfully connected to NATS')

  const stringCodec = StringCodec();
  const subscription = nc.subscribe('aircraft');

  for await (const message of subscription) {
    const aircraft: EnrichedAircraft = JSON.parse(stringCodec.decode(message.data))
    onAircraft(aircraft)
  }
};

main();
