import mongoose from "mongoose";
const Schema = mongoose.Schema;
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
    userId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    feedback: {
      type: String,
      required: true,
    },
    position: [vectorSchema],
    orientation: [orientationSchema],
    date: { type: Date, default: Date.now },
    map_image: [{
      type: String,
      required: true,
  }],
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
  "automated-Disinfection",
  automatedDisinfectantDataSchema
);

export default AutomatedDisinfectantData;
