import { model, Schema, Document } from "npm:mongoose@8.13.0"

interface Aircraft extends Document {
  aiocHexCode: string;
  registeredOwners: string | null;
  manufacturer: string | null;
  aircraftModel: string | null; // Avoid clash with `model` method
  isInteresting: boolean;
  interestingCivMilPolGov?: string;
  interestingCategory?: string;
  interestingTags?: string[];
}

const aircraftSchema = new Schema<Aircraft>({
  aiocHexCode: { type: String, required: true, unique: true },
  registeredOwners: { type: String, required: false, default: null },
  manufacturer: { type: String, required: false, default: null },
  aircraftModel: { type: String, required: false, default: null },
  isInteresting: { type: Boolean, required: true },
  interestingCivMilPolGov: { type: String, required: false },
  interestingCategory: { type: String, required: false },
  interestingTags: { type: [String], required: false }
}, { collection: "aircraft" });

export const AircraftModel = model('Aircraft', aircraftSchema);
