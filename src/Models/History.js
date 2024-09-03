import { Schema, model } from "mongoose";

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

const historySchema = new Schema({
  robotName: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  robotId: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },

  mapName: { type: String, required: true },
  image: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  percentCompleted: { type: Number, required: true },
  status: { type: String, required: true },
  linear_velocity: [vectorSchema],
  angular_velocity: [vectorSchema],
  position: [vectorSchema],
  orientation: [orientationSchema],

});

const History = model("History", historySchema);
export default History;
