import * as dotenv from "dotenv";

import { EnrichedAircraft } from "./Aircraft";
import { connect, StringCodec } from "nats";
import { onAircraft } from "./onAircraft";
import { logger } from './logger'

dotenv.config();

const PUSHOVER_APP_TOKEN = process.env.PUSHOVER_APP_TOKEN;
const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;

if (!PUSHOVER_APP_TOKEN) {
  logger.fatal('env var PUSHOVER_APP_TOKEN missing');
  process.exit(1);
}

if (!PUSHOVER_USER_KEY) {
  logger.fatal('env var PUSHOVER_USER_KEY missing');
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
