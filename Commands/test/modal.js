const {
  SlashCommandBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  ModalBuilder,
} = require("discord.js");
module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Returns modal")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("My Modal");

    const favoriteColorInput = new TextInputBuilder()
      .setCustomId("favclr")
      .setLabel("What's your favorite color?")
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(
      favoriteColorInput
    );

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },
};
