import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const guildIdSchema = new Schema({
  guildId: {
    type: Number,
    required: true,
  },
});

const GuildIDs = model('antiToxic', guildIdSchema);

export default GuildIDs;
