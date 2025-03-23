import path from "path";
import * as dotenv from "dotenv";

import { fetchAircraftData } from "./fetchAircraft";
import { fetchInterestingAircraft } from "./fetchInterestingAircraft";
import {
  createTableOfAircraftByInteresting,
  createTableOfAircraftByMakeModel,
  createTableOfAircraftByOwner,
  summariseAircraft,
} from "./summary";

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

  console.log(
    createTableOfAircraftByOwner(byOwner, aircraftData.length).toString()
  );
  console.log(
    createTableOfAircraftByMakeModel(byMake, aircraftData.length).toString()
  );
  console.log(createTableOfAircraftByInteresting(aircraftData).toString());

  // TODO: Trigger notification if emergency / military / interesting present
};

getAircraftData();
