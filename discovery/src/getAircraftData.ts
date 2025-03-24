import path from "path";
import { NatsConnection, StringCodec } from "nats";
import * as dotenv from 'dotenv'

import { fetchAircraftData } from "./fetchAircraft";
import { fetchInterestingAircraft } from "./fetchInterestingAircraft";
import { logger } from "./logger";

const pathToCsv = path.join(__dirname, "plane-alert-db", "plane-alert-db.csv");

const sc = StringCodec();

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

export const getAircraftData = async (nc: NatsConnection) => {
  logger.info('Getting aircraft data...')

  const interestingAircraftDb = await fetchInterestingAircraft(pathToCsv);
  const aircraftData = await fetchAircraftData(
    TAR1090_URL,
    HEXDB_API_URL,
    interestingAircraftDb
  );

  logger.info(`Aircraft found: ${aircraftData.length}`);

  for (const aircraft of aircraftData) {
    nc.publish('aircraft', sc.encode(JSON.stringify(aircraft)));
  }
};