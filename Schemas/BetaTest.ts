import mongoose from "mongoose";
const { Schema, model } = mongoose;

const BetaTestSchema = new Schema({
  userID: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  addedBy: {
    type: String,
    required: true
  },
});

const BetaTestUsers = model("BetaTestUsers", BetaTestSchema);

export default BetaTestUsers;