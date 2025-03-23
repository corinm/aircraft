import * as dotenv from "dotenv";
import NodeCache from "node-cache";

import { sendNotification } from "./notifications";
import { EnrichedAircraft, printAircraft } from "./Aircraft";
import { connect, StringCodec } from "nats";

dotenv.config();

const PUSHOVER_APP_TOKEN = process.env.PUSHOVER_APP_TOKEN;
const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;

if (!PUSHOVER_APP_TOKEN) {
  process.exit(1);
}

if (!PUSHOVER_USER_KEY) {
  process.exit(1);
}

const cache = new NodeCache({
  stdTTL: 20 * 60,
  checkperiod: 60,
});

const onAircraft = async (aircraft: EnrichedAircraft) => {
  if (!aircraft.isInteresting) {
    console.log("> Aircraft not interesting");
    return;
  }

  console.log("> Interesting aircraft found");

  if (cache.has(aircraft.aiocHexCode)) {
    console.log("> Aircraft not new");
    return;
  }

  console.log("> New interesting aircraft found");

  cache.set(aircraft.aiocHexCode, true);

  console.log("> Sending notification");

  const message = `Interesting aircraft: ${printAircraft(aircraft)}`;

  sendNotification(PUSHOVER_APP_TOKEN, PUSHOVER_USER_KEY, message);
};

const main = async () => {
  const nc = await connect({ servers: ['nats://message-bus:4222'] });
  const sc = StringCodec();

  const sub = nc.subscribe('aircraft');

  for await (const m of sub) {
    onAircraft(JSON.parse(sc.decode(m.data)))
  }
};

main();
