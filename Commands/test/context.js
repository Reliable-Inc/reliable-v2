const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require('discord.js');
const { colors } = require('discordjs-colors-bundle');

module.exports = {
  developer: true,
  data: new ContextMenuCommandBuilder()
    .setName('getAvatar')
    .setType(ApplicationCommandType.User),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('Commands - Developer')
      .setColor(colors.LimeFizz)
      .setImage(
        interaction.targetUser.displayAvatarURL() ??
          interaction.user.displayAvatarURL()
      );

    await interaction.reply({ embeds: [embed] });
  },
};
