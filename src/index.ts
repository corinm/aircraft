import path from "path";
import * as dotenv from "dotenv";
import CliTable3 from "cli-table3";

import { fetchAircraftData } from "./fetchAircraft";
import { fetchInterestingAircraft } from "./fetchInterestingAircraft";
import { summariseAircraft } from "./summary";

dotenv.config();

const TAR1090_URL = process.env.TAR1090_URL;
const HEXDB_API_URL = process.env.HEXDB_API_URL;

if (!TAR1090_URL) {
  process.exit(1);
}

if (!HEXDB_API_URL) {
  process.exit(1);
}

const pathToCsv = path.join(__dirname, "plane-alert-db", "plane-alert-db.csv");

const getAircraftData = async () => {
  const interestingAircraft = await fetchInterestingAircraft(pathToCsv);
  const aircraftData = await fetchAircraftData(
    TAR1090_URL,
    HEXDB_API_URL,
    interestingAircraft
  );

  const { byOwner, byMake } = summariseAircraft(aircraftData);

  // Owner
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
  table.push(["Total", aircraftData.length]);
  console.log(table.toString());

  // Make and model
  const table2 = new CliTable3({
    head: ["Make & Model", "Count"],
  });
  for (const [makeModel, count] of Object.entries(byMake)) {
    table2.push([makeModel, count]);
  }
  table2.sort((a, b) => {
    const a2 = a as [string, number];
    const b2 = b as [string, number];
    return b2[1] - a2[1];
  });
  table2.push(["Total", aircraftData.length]);
  console.log(table2.toString());

  // Type
  const table3 = new CliTable3({
    head: ["Type", "Count"],
  });

  table3.push(["Emergency", aircraftData.filter((a) => a.isEmergency).length]);
  table3.push(["Military", aircraftData.filter((a) => a.isMilitary).length]);
  table3.push([
    "Interesting",
    aircraftData.filter((a) => a.isInteresting).length,
  ]);

  console.log(table3.toString());

  // TODO: Trigger notification if emergency / military / interesting present
};

getAircraftData();
