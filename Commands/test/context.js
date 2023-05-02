const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  ContextMenuCommandInteraction,
} = require("discord.js");
const { colors } = require("discordjs-colors-bundle");

module.exports = {
  developer: true,
  data: new ContextMenuCommandBuilder()
    .setName("getAvatar")
    .setType(ApplicationCommandType.User),

  /**
   *
   * @param {ContextMenuCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Commands - Developer")
      .setColor(colors.LimeFizz)
      .setImage(interaction.user.avatarURL({ extension: "png" }));

    await interaction.reply({ embeds: [embed] });
  },
};
