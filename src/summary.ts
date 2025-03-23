import CliTable3 from "cli-table3";
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

export const createTableOfAircraftByOwner = (
  byOwner: OwnerToCount,
  total: number
) => {
  const table = new CliTable3({
    head: ["Owner", "Count"],
  });
  for (const [owner, count] of Object.entries(byOwner)) {
    table.push([owner, count]);
  }
  table.sort((a, b) => {
    const a2 = a as [string, number];
    const b2 = b as [string, number];
    return b2[1] - a2[1];
  });
  table.push(["Total", total]);
  return table;
};

export const createTableOfAircraftByMakeModel = (
  byMakeModel: MakeModelToCount,
  total: number
) => {
  const table = new CliTable3({
    head: ["Make & Model", "Count"],
  });
  for (const [makeModel, count] of Object.entries(byMakeModel)) {
    table.push([makeModel, count]);
  }
  table.sort((a, b) => {
    const a2 = a as [string, number];
    const b2 = b as [string, number];
    return b2[1] - a2[1];
  });
  table.push(["Total", total]);
  return table;
};

export const createTableOfAircraftByInteresting = (
  aircraftData: EnrichedAircraft[]
) => {
  const table = new CliTable3({
    head: ["Type", "Count"],
  });

  table.push(["Emergency", aircraftData.filter((a) => a.isEmergency).length]);
  table.push(["Military", aircraftData.filter((a) => a.isMilitary).length]);
  table.push([
    "Interesting",
    aircraftData.filter((a) => a.isInteresting).length,
  ]);
  return table;
};
