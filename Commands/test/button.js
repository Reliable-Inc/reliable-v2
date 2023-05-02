const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Returns button")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const button = new ButtonBuilder()
      .setCustomId("tst-btn")
      .setStyle(ButtonStyle.Success)
      .setLabel("button");

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ components: [row] });
  },
};
