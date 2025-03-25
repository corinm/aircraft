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
        aircraftModel: aircraft.hexDbMetadata?.Type,
        isInteresting: aircraft.isInteresting,
        interestingCivMilPolGov: aircraft.planeAlertDb?.CMPG ?? undefined,
        interestingCategory: aircraft.planeAlertDb?.Category ?? undefined,
        interestingTags: aircraft.isInteresting ? [
          aircraft.planeAlertDb?.Tag1 ?? null,
          aircraft.planeAlertDb?.Tag2 ?? null,
          aircraft.planeAlertDb?.Tag3 ?? null,
        ].filter(v => v !== null) : undefined
      }
    },
    { upsert: true }
  )
}