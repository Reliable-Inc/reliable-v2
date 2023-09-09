import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const guildIdSchema = new Schema({
  guildId: {
    type: Number,
    required: true,
  },
});

const antiProfanity = model('antiProfanity', guildIdSchema);

export default antiProfanity;
