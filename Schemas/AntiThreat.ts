import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const guildIdSchema = new Schema({
  guildId: {
    type: Number,
    required: true,
  },
});

const AntiThreatGuildIDs = model('antiThreat', guildIdSchema);

export default AntiThreatGuildIDs;
