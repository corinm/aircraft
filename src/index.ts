import path from "path";
import * as dotenv from "dotenv";
import NodeCache from "node-cache";

import { fetchAircraftData } from "./fetchAircraft";
import { fetchInterestingAircraft } from "./fetchInterestingAircraft";
import {
  createTableOfAircraftByInteresting,
  createTableOfAircraftByMakeModel,
  createTableOfAircraftByOwner,
  summariseAircraft,
} from "./summary";
import { sendNotification } from "./notifications";
import { printAircraft } from "./Aircraft";

dotenv.config();

const TAR1090_URL = process.env.TAR1090_URL;
const HEXDB_API_URL = process.env.HEXDB_API_URL;
const PUSHOVER_APP_TOKEN = process.env.PUSHOVER_APP_TOKEN;
const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;

if (!TAR1090_URL) {
  process.exit(1);
}

if (!HEXDB_API_URL) {
  process.exit(1);
}

if (!PUSHOVER_APP_TOKEN) {
  process.exit(1);
}

if (!PUSHOVER_USER_KEY) {
  process.exit(1);
}

const pathToCsv = path.join(__dirname, "plane-alert-db", "plane-alert-db.csv");

const interestingAircraftCache = new NodeCache({
  stdTTL: 20 * 60,
  checkperiod: 60,
});

const getAircraftData = async () => {
  console.log("");
  console.log("> Getting aircraft data");

  const interestingAircraftDb = await fetchInterestingAircraft(pathToCsv);
  const aircraftData = await fetchAircraftData(
    TAR1090_URL,
    HEXDB_API_URL,
    interestingAircraftDb
  );

  console.log(`> ${aircraftData.length} aircraft found`);

  // const { byOwner, byMake } = summariseAircraft(aircraftData);

  // console.log(
  //   createTableOfAircraftByOwner(byOwner, aircraftData.length).toString()
  // );
  // console.log(
  //   createTableOfAircraftByMakeModel(byMake, aircraftData.length).toString()
  // );
  // console.log(createTableOfAircraftByInteresting(aircraftData).toString());

  const interestingAircraft = aircraftData.filter((a) => a.isInteresting);

  if (interestingAircraft.length === 0) {
    console.log("> No interesting aircraft");
    return;
  }

  console.log("> Interesting aircraft found");

  const newInterestingAircraft = interestingAircraft.filter(
    (a) => !interestingAircraftCache.has(a.aiocHexCode)
  );

  if (newInterestingAircraft.length == 0) {
    console.log("> No new interesting aircraft");
    return;
  }

  console.log("> New interesting aircraft found");

  newInterestingAircraft.forEach((a) =>
    interestingAircraftCache.set(a.aiocHexCode, true)
  );

  console.log("> Sending notification");

  const message = `Interesting aircraft: ${newInterestingAircraft.map(
    printAircraft
  )}`;

  sendNotification(PUSHOVER_APP_TOKEN, PUSHOVER_USER_KEY, message);
};

const main = () => {
  console.log("> Setting interval");
  setInterval(getAircraftData, 60_000);

  console.log("> One off invokation");
  getAircraftData();
};

main();
