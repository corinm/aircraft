import * as dotenv from "dotenv";

import { isEmergency, printAircraft, isMilitary } from "./Aircraft";
import { fetchAircraftData } from "./fetchAircraft";

dotenv.config();

const TAR1090_URL = process.env.TAR1090_URL;
const HEXDB_API_URL = process.env.HEXDB_API_URL;

if (!TAR1090_URL) {
  process.exit(1);
}

if (!HEXDB_API_URL) {
  process.exit(1);
}

const getAircraftData = async () => {
  const aircraftData = await fetchAircraftData(TAR1090_URL, HEXDB_API_URL);

  if (aircraftData.some(isEmergency)) {
    console.log("!! EMERGENCY AIRCRAFT PRESENT !!");
  }

  if (aircraftData.some(isMilitary)) {
    console.log("Military aircraft present");
  }

  aircraftData.forEach(printAircraft);
};

getAircraftData();
