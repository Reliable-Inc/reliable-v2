import GuildIDs from '../../Schemas/AntiToxic';
const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove command')
    .addSubcommand(sub =>
      sub.setName('anti-toxic').setDescription('Remove Anti-Toxic.')
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() == 'anti-toxic') {
      const guildId = interaction.guild.id;
      const isEnabled = await GuildIDs.findOne({ guildId });

      if (!isEnabled) {
        return interaction.reply({
          content: 'Anti Toxic is not enabled in this guild.',
          ephemeral: true,
        });
      }
      await GuildIDs.deleteOne({ guildId });
      return interaction.reply({
        content: 'Successfully removed AntiToxic from this guild.',
        ephemeral: true,
      });
    }
  },
};
