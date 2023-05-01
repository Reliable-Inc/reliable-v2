const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
const ms = require("ms");
const list = require("badwords-list");
const words = require("./bad-words.json");

const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require("discord.js");

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Replies with what you've said.")
    .addStringOption((op) =>
      op.setName("message").setDescription("message to say").setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const toSay = interaction.options.getString("message");

    const badWords = Object.values(words).concat(list.array);

    if (badWords.some((word) => toSay.toLowerCase().includes(word))) {
      return interaction.reply({
        content: `Watch your language! You cannot send a message with swearing words!`,
        ephemeral: true,
      });
    }
    if (toSay.includes("@")) {
      return interaction.reply({
        content: "Cannot send messages with mention.",
        ephemeral: true,
      });
    }

    interaction.channel.send(`${toSay}`) &&
      interaction.reply({ content: `Sent "${toSay}"`, ephemeral: true });
  },
};
