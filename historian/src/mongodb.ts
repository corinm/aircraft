import mongoose from 'mongoose'

const aircraftSchema = new mongoose.Schema({
  aiocHexCode: { type: String, required: true },
  registeredOwners: { type: String, required: false },
  manufacturer: { type: String, required: false },
  model: { type: String, required: false },
  isInteresting: { type: Boolean, required: false },
});
  
export const AircraftModel = mongoose.model('Aircraft', aircraftSchema);
