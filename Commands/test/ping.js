const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns bot ping"),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.reply({
      content: `Pong ${client.ws.ping}`,
      ephemeral: true,
    });
  },
};
