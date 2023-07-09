import mongoose from "mongoose";

const serverKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
});

const ServerKey = mongoose.model('ServerKey', serverKeySchema);

export default ServerKey;