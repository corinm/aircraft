import { Application, Router } from "@oak/oak";
import mongoose from "npm:mongoose@8.13.0"
import { pino } from "npm:pino@9.6.0"
import { AircraftModel } from "./model/Aircraft.ts";

const logger = pino({ "name": "aircraft.stats", "level": "info" })

export const server = async () => {
  logger.info('Connecting to MongoDB...')
  await mongoose.connect('mongodb://root:root@mongodb:27017/aircraft-historian', { authSource: 'admin' })
  logger.info('Successfully connected to MongoDB')

  const router = new Router();

  router.get("/aircraft", async (ctx) => {
    // interestingAircraft: await AircraftModel.find({ isInteresting: true }),
    const aircraftDocs = await AircraftModel.find({});

    ctx.response.body = aircraftDocs;
  });

  router.get("/", async (ctx) => {
    const stats = {
      total: await AircraftModel.countDocuments(),
      isInterestingCount: await AircraftModel.find({ isInteresting: true }).countDocuments(),
      uniqueModelsCount: (await AircraftModel.aggregate([
        {
          $group: {
            _id: { manufacturer: "$manufacturer", aircraftModel: "$aircraftModel" }
          },
        },
        {
          $count: "count"
        }
      ]))[0].count,
      uniqueRegisteredOwnersCount: (await AircraftModel.aggregate([
        {
          $group: {
            _id: { registeredOwner: "$registeredOwners" }
          },
        },
        {
          $count: "count"
        }
      ]))[0].count,
      countsByModel: await AircraftModel.aggregate([
        {
          $group: {
            _id: { manufacturer: "$manufacturer", aircraftModel: "$aircraftModel" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),
      countsByRegisteredOwner: await AircraftModel.aggregate([
        {
          $group: {
            _id: { registeredOwners: "$registeredOwners" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ])
    }

    ctx.response.body = stats;
  });

  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen({ hostname: "0.0.0.0", port: 80 });
}
