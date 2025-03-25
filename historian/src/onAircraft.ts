import { Mongoose } from 'mongoose'

import { EnrichedAircraft } from "./Aircraft";
import { logger } from "./logger";
import { AircraftModel } from './mongodb';

export const onAircraft = async (aircraft: EnrichedAircraft) => {
  logger.info(`Aircraft: ${aircraft.aiocHexCode} ${aircraft.hexDbMetadata?.RegisteredOwners} ${aircraft.hexDbMetadata?.Manufacturer} ${aircraft.hexDbMetadata?.Type}`)

  await AircraftModel.updateOne(
    { aiocHexCode: aircraft.aiocHexCode },
    { $set:
      {
        registeredOwners: aircraft.hexDbMetadata?.RegisteredOwners,
        manufacturer: aircraft.hexDbMetadata?.Manufacturer,
        model: aircraft.hexDbMetadata?.Type,
      }
    },
    { upsert: true }
  )
}