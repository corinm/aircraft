import path from "path";
import * as dotenv from "dotenv";

import { fetchAircraftData } from "./fetchAircraft";
import { fetchInterestingAircraft } from "./fetchInterestingAircraft";
import { connect, NatsConnection, StringCodec } from "nats";

dotenv.config();

const TAR1090_URL = process.env.TAR1090_URL;
const HEXDB_API_URL = process.env.HEXDB_API_URL;

if (!TAR1090_URL) {
  console.log('env var TAR1090_URL missing');
  process.exit(1);
}

if (!HEXDB_API_URL) {
  console.log('env var HEXDB_API_URL missing');
  process.exit(1);
}

const pathToCsv = path.join(__dirname, "plane-alert-db", "plane-alert-db.csv");

const sc = StringCodec();

const getAircraftData = async (nc: NatsConnection) => {
  console.log("> Getting aircraft data");

  const interestingAircraftDb = await fetchInterestingAircraft(pathToCsv);
  const aircraftData = await fetchAircraftData(
    TAR1090_URL,
    HEXDB_API_URL,
    interestingAircraftDb
  );

  console.log(`> ${aircraftData.length} aircraft found`);

  for (const aircraft of aircraftData) {
    nc.publish('aircraft', sc.encode(JSON.stringify(aircraft)));
  }

  // const { byOwner, byMake } = summariseAircraft(aircraftData);

  // console.log(
  //   createTableOfAircraftByOwner(byOwner, aircraftData.length).toString()
  // );
  // console.log(
  //   createTableOfAircraftByMakeModel(byMake, aircraftData.length).toString()
  // );
  // console.log(createTableOfAircraftByInteresting(aircraftData).toString());

  // const interestingAircraft = aircraftData.filter((a) => a.isInteresting);

  // if (interestingAircraft.length === 0) {
  //   console.log("> No interesting aircraft");
  //   return;
  // }

  // console.log("> Interesting aircraft found");

  // const newInterestingAircraft = interestingAircraft.filter(
  //   (a) => !interestingAircraftCache.has(a.aiocHexCode)
  // );

  // if (newInterestingAircraft.length == 0) {
  //   console.log("> No new interesting aircraft");
  //   return;
  // }

  // console.log("> New interesting aircraft found");

  // newInterestingAircraft.forEach((a) => {
  //   interestingAircraftCache.set(a.aiocHexCode, true);
    
  //   const subject = 'example.subject';
  //   const message = 'Hello, NATS!';
  //   nc.publish(subject, sc.encode(message));
  // });
};

const main = async () => {
  const nc = await connect({ servers: ['nats://message-bus:4222'] });

  console.log("> Setting interval");
  setInterval(() => getAircraftData(nc), 60_000);

  console.log("> One off invokation");
  getAircraftData(nc);
};

main();
