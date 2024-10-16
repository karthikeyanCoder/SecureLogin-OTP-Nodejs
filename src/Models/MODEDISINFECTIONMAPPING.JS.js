import mongoose from "mongoose";
const Schema = mongoose.Schema;
//automatic disinfection mapping
const vectorSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  { _id: false }
);

const orientationSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
    w: { type: Number, required: true },
  },
  { _id: false }
);
const automatedDisinfectantDataSchema = new mongoose.Schema(
  {
   

    feedback: {
      type: String,
      required: true,
    },
    position: [vectorSchema],
    orientation: [orientationSchema],
    date: { type: Date, default: Date.now },
    map_image: {
      type: Buffer,
      required: true,
    },
    object_image_name: {
      type: String,
      required: true,
    },
    object_feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AutomatedDisinfectantData = mongoose.model(
  "mode_Disinfection_mapping",
  automatedDisinfectantDataSchema
);

export default AutomatedDisinfectantData;
