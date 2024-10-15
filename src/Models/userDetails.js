import mongoose from "mongoose";

const Schema = mongoose.Schema;

const detailsSchema = new Schema( //only role user only stored datas 
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    location:{ type: String, required: true },
  },
  { timestamps: true }
);

const userDetails = mongoose.model("userDetails", detailsSchema);
export default userDetails;
