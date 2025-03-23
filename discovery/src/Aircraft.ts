export interface Tar1090Aircraft {
  hex: string;
  type: string;
  flight: string | undefined;
  alt_baro: number;
  alt_geom: number;
  gs: number;
  ias: number;
  tas: number;
  mach: number;
  wd: number;
  ws: number;
  oat: number;
  tat: number;
  track: number;
  track_rate: number;
  roll: number;
  mag_heading: number;
  true_heading: number;
  baro_rate: number;
  geom_rate: number;
  squawk: string;
  emergency: string;
  category: string;
  nav_qnh: number;
  nav_altitude_mcp: number;
  nav_altitude_fms: number;
  nav_heading: number;
  lat: number;
  lon: number;
  nic: number;
  rc: number;
  seen_pos: number;
  r_dst: number;
  r_dir: number;
  version: number;
  nic_baro: number;
  nac_p: number;
  nac_v: number;
  sil: number;
  sil_type: string;
  gva: number;
  sda: number;
  alert: number;
  spi: number;
  mlat: unknown[];
  tisb: unknown[];
  messages: number;
  seen: number;
  rssi: number;
}

export interface HexDbAircraftMetadata {
  ICAOTypeCode: string;
  Manufacturer: string;
  ModeS: string;
  OperatorFlagCode: string;
  RegisteredOwners: string;
  Registration: string;
  Type: string;
}

export interface BaseAircraft {
  aiocHexCode: string;
  adsbData: Tar1090Aircraft;
}

export interface WithHexDbMetadata extends BaseAircraft {
  // Can be null if request failed or aircraft not found in HexDB
  hexDbMetadata: HexDbAircraftMetadata | null;
}

export interface WithEmergencyMetadata extends WithHexDbMetadata {
  isEmergency: boolean;
}

export interface WithMilitaryMetadata extends WithEmergencyMetadata {
  isMilitary: boolean;
}

export interface WithInterestingMetadata extends WithMilitaryMetadata {
  isInteresting: boolean;
}

export type EnrichedAircraft = WithInterestingMetadata;

export const isEmergency = (
  aircraft: BaseAircraft | EnrichedAircraft
): boolean => {
  if (aircraft.adsbData.emergency === undefined) {
    return false;
  }

  if (aircraft.adsbData.emergency == "none") {
    return false;
  }

  return true;
};

export const isMilitary = (aircraft: BaseAircraft | EnrichedAircraft) => {
  // TODO: Implement
  return false;
};


