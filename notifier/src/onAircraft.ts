import * as dotenv from "dotenv";
import NodeCache from "node-cache";

import { sendPushoverNotification } from "./notifications";
import { EnrichedAircraft } from "./Aircraft";
import { logger } from './logger'
import { printAircraft } from "./printAircraft";

dotenv.config();

const PUSHOVER_APP_TOKEN = process.env.PUSHOVER_APP_TOKEN;
const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;

if (!PUSHOVER_APP_TOKEN) {
  process.exit(1);
}

if (!PUSHOVER_USER_KEY) {
  process.exit(1);
}

const cache = new NodeCache({
  stdTTL: 20 * 60,
  checkperiod: 60,
});

export const onAircraft = async (aircraft: EnrichedAircraft) => {
    if (!aircraft.isInteresting) {
      logger.debug('Aircraft not interesting')
      return;
    }

  
    if (cache.has(aircraft.aiocHexCode)) {
      logger.debug('Aircraft not new')
      return;
    }

    logger.info(`New interesting aircraft found: ${aircraft.aiocHexCode} ${aircraft.hexDbMetadata?.RegisteredOwners} ${aircraft.hexDbMetadata?.Manufacturer} ${aircraft.hexDbMetadata?.Type}`)
  
    cache.set(aircraft.aiocHexCode, true);
  
    logger.info('Sending notification...')
  
    const message = `Interesting aircraft: ${printAircraft(aircraft)}`;
  
    sendPushoverNotification(PUSHOVER_APP_TOKEN, PUSHOVER_USER_KEY, message);
  };