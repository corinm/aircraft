import { Mongoose } from 'mongoose'

import { EnrichedAircraft } from "./Aircraft";
import { logger } from "./logger";
import { AircraftModel } from './mongodb';

export const onAircraft = async (mongoose: Mongoose, aircraft: EnrichedAircraft) => {
  logger.info(`Aircraft: ${aircraft.aiocHexCode} ${aircraft.hexDbMetadata?.RegisteredOwners} ${aircraft.hexDbMetadata?.Manufacturer} ${aircraft.hexDbMetadata?.Type}`)

  const aircraftRecord = new AircraftModel({
    aiocHexCode: aircraft.aiocHexCode,
    registeredOwners: aircraft.hexDbMetadata?.RegisteredOwners,
    manufacturer: aircraft.hexDbMetadata?.Manufacturer,
    model: aircraft.hexDbMetadata?.Type,
  })

  await aircraftRecord.save()
}