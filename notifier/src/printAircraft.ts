import { EnrichedAircraft } from "./Aircraft";

export const printAircraft = (aircraft: EnrichedAircraft): string => {
  const { aiocHexCode, adsbData, hexDbMetadata } = aircraft;
  const { flight } = adsbData;
  const RegisteredOwners = hexDbMetadata?.RegisteredOwners ?? "-";
  const Manufacturer = hexDbMetadata?.Manufacturer ?? "-";
  const ICAOTypeCode = hexDbMetadata?.ICAOTypeCode ?? "-";

  return `${aiocHexCode} ${
    flight?.trim() ?? "-"
  } ${RegisteredOwners} ${Manufacturer} ${ICAOTypeCode}`;
};
