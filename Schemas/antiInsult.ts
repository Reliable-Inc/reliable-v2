import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const guildIdSchema = new Schema({
  guildId: {
    type: Number,
    required: true,
  },
});

const AntiInsultGuildIDs = model('antiInsult', guildIdSchema);

export default AntiInsultGuildIDs;
