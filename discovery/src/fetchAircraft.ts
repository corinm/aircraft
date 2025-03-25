import axios from "axios";
import {
  BaseAircraft,
  EnrichedAircraft,
  HexDbAircraftMetadata,
  Tar1090Aircraft,
  WithEmergencyMetadata,
  WithHexDbMetadata,
  WithInterestingMetadata,
  WithMilitaryMetadata,
  isEmergency,
  isMilitary,
} from "./Aircraft";
import { InterestingAircraftDictionary } from "./fetchInterestingAircraft";

export const fetchAircraftData = async (
  tar1090Url: string,
  hexDbUrl: string,
  interestingAircraft: InterestingAircraftDictionary
): Promise<EnrichedAircraft[]> => {
  const aircraftData = await fetchAircraftFromTar1090(tar1090Url);
  const withHexDbMetadata = await attachHexDbMetadata(hexDbUrl, aircraftData);
  const withIsEmergency = attachEmergencyMetadata(withHexDbMetadata);
  const withIsMilitary = attachMilitaryMetadata(withIsEmergency);
  const withIsInteresting = attachIsInterestingMetadata(
    interestingAircraft,
    withIsMilitary
  );
  return withIsInteresting;
};

const fetchAircraftFromTar1090 = async (
  tar1090Url: string
): Promise<BaseAircraft[]> => {
  const response = await axios.get(tar1090Url);

  // TODO: Add some validation
  return response.data.aircraft.map((aircraft: Tar1090Aircraft) => ({
    aiocHexCode: aircraft.hex,
    adsbData: aircraft,
  }));
};

const attachHexDbMetadata = async (
  hexDbUrl: string,
  aircraftData: BaseAircraft[]
) => {
  const enrichedAircraftData = await Promise.all(
    aircraftData.map(async (aircraft) => {
      const metadata = await fetchMetaDataFromHexDB(
        hexDbUrl,
        aircraft.aiocHexCode
      );

      return {
        ...aircraft,
        hexDbMetadata: metadata,
      };
    })
  );

  return enrichedAircraftData;
};

const fetchMetaDataFromHexDB = async (
  hexDbUrl: string,
  aiocHexCode: string
): Promise<HexDbAircraftMetadata | null> => {
  try {
    const metadataResponse = await axios.get<HexDbAircraftMetadata>(
      `${hexDbUrl}/${aiocHexCode}`
    );
    return metadataResponse.data;
  } catch (e) {
    if (!isErrorWithStatus(e)) {
      throw e;
    }

    if (e.status === 404) {
      return null;
    }

    throw e;
  }
};

const isErrorWithStatus = (error: unknown): error is { status: number } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as any).status === "number"
  );
};

const attachEmergencyMetadata = (
  aircraftData: WithHexDbMetadata[]
): WithEmergencyMetadata[] => {
  return aircraftData.map((aircraft) => ({
    ...aircraft,
    isEmergency: isEmergency(aircraft),
  }));
};

const attachMilitaryMetadata = (
  aircraftData: WithEmergencyMetadata[]
): WithMilitaryMetadata[] => {
  return aircraftData.map((aircraft) => ({
    ...aircraft,
    isMilitary: isMilitary(aircraft),
  }));
};

const attachIsInterestingMetadata = (
  interestingAircraft: InterestingAircraftDictionary,
  aircraftData: WithMilitaryMetadata[]
): WithInterestingMetadata[] => {
  return aircraftData.map((a) => ({
    ...a,
    isInteresting: !!interestingAircraft[a.aiocHexCode],
    planeAlertDb: interestingAircraft[a.aiocHexCode] ?? null,
  }));
};
