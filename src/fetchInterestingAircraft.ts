import * as fs from "fs";
import * as csv from "csv-parser";

interface AircraftRecord {
  ICAO: string;
  Registration: string;
  Operator: string;
  Type: string;
  ICAOType: string;
  CMPG: number;
  Tag1: string;
  Tag2: string;
  Tag3: string;
  Category: string;
  Link: string;
}

export const fetchInterestingAircraft = async (
  pathToCsv: string
): Promise<Set<string>> => {
  const aircraft = await readAircraftCSV(pathToCsv);
  return new Set(aircraft.map((a) => a.ICAO).map((icao) => icao.toLowerCase()));
};

const readAircraftCSV = async (filePath: string): Promise<AircraftRecord[]> => {
  return new Promise((resolve, reject) => {
    const records: AircraftRecord[] = [];

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
        const record: AircraftRecord = {
          ICAO: row["$ICAO"],
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
        records.push(record);
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
