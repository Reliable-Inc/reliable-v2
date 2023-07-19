import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const guildIdSchema = new Schema({
  guildId: {
    type: Number,
    required: true,
  },
});

const AntiObsceneGuildIDs = model('antiObscene', guildIdSchema);

export default AntiObsceneGuildIDs;
