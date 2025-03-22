import { EnrichedAircraft } from "./Aircraft";

type OwnerToCount = {
  [key: string]: number;
};

type MakeModelToCount = {
  [key: string]: number;
};

export const summariseAircraft = (aircraftData: EnrichedAircraft[]) => {
  const byOwner = aircraftData.reduce<OwnerToCount>((prev, cur) => {
    const owner = cur.hexDbMetadata?.RegisteredOwners ?? "Unknown";
    const count = prev[owner] === undefined ? 1 : prev[owner] + 1;
    return { ...prev, [owner]: count };
  }, {});

  const byMake = aircraftData.reduce<MakeModelToCount>((prev, cur) => {
    const makeModel = cur.hexDbMetadata?.Manufacturer
      ? `${cur.hexDbMetadata?.Manufacturer} ${
          cur.hexDbMetadata?.Type.split(" ")[0]
        }`
      : "Unknown";
    const count = prev[makeModel] === undefined ? 1 : prev[makeModel] + 1;
    return { ...prev, [makeModel]: count };
  }, {});

  return { byOwner, byMake };
};
