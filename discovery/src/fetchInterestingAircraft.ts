import * as fs from "fs";
import * as csv from "csv-parser";
import { PlaneAlertDbAircraftRecord } from "./Aircraft";

export interface InterestingAircraftDictionary {
  [key: string]: PlaneAlertDbAircraftRecord;
}

export const fetchInterestingAircraft = async (
  pathToCsv: string
): Promise<InterestingAircraftDictionary> => {
  const aircraft = await readAircraftCSV(pathToCsv);
  return aircraft
};

const readAircraftCSV = async (filePath: string): Promise<InterestingAircraftDictionary> => {
  return new Promise((resolve, reject) => {
    const records: InterestingAircraftDictionary = {};

    fs.createReadStream(filePath)
      .pipe(
        csv.default({
          headers: [
            "$ICAO",
            "$Registration",
            "$Operator",
            "$Type",
            "$ICAO Type",
            "#CMPG",
            "$Tag 1",
            "$#Tag 2",
            "$#Tag 3",
            "Category",
            "$#Link",
          ],
          skipLines: 1,
        })
      )
      .on("data", (row) => {
        const record: PlaneAlertDbAircraftRecord = {
          ICAO: row["$ICAO"].toLowerCase(),
          Registration: row["$Registration"],
          Operator: row["$Operator"],
          Type: row["$Type"],
          ICAOType: row["$ICAO Type"],
          CMPG: row["#CMPG"],
          Tag1: row["$Tag 1"],
          Tag2: row["$#Tag 2"],
          Tag3: row["$#Tag 3"],
          Category: row["Category"],
          Link: row["$#Link"],
        };
        records[record.ICAO] = record
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
