import axios from "axios";
import { RawAircraft, Tar1090AircraftData } from "./Aircraft";

export const fetchAircraftFromTar1090 = async (
  tar1090Url: string
): Promise<RawAircraft[]> => {
  const response = await axios.get(tar1090Url);

  return response.data.aircraft.map((aircraft: Tar1090AircraftData) => ({
    aiocHexCode: aircraft.hex,
    adsbData: aircraft,
  }));
};
