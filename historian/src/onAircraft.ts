import { EnrichedAircraft } from "./Aircraft";
import { logger } from "./logger";

export const onAircraft = async (aircraft: EnrichedAircraft) => {
  logger.info(`Aircraft: ${aircraft.aiocHexCode} ${aircraft.hexDbMetadata?.RegisteredOwners} ${aircraft.hexDbMetadata?.Manufacturer} ${aircraft.hexDbMetadata?.Type}`)
}