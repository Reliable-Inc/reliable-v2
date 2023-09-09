import GuildIDs from '../../Schemas/AntiToxic';
import AntiInsultGuildIDs from '../../Schemas/antiInsult';
import AntiObsceneGuildIDs from '../../Schemas/AntiObscene';
import AntiThreatGuildIDs from '../../Schemas/AntiThreat';
import antiProfanity from '../../Schemas/AntiProfanity';

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
    )
    .addSubcommand(sub =>
      sub.setName('anti-obscene').setDescription('Remove Anti-Obscene.')
    )
    .addSubcommand(sub =>
      sub.setName('anti-threat').setDescription('Remove Anti-Threat.')
    )
    .addSubcommand(sub =>
      sub.setName('anti-insult').setDescription('Remove Anti-Insult.')
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
    } else if (interaction.options.getSubcommand() == 'anti-obscene') {
      const guildId = interaction.guild.id;
      const isEnabled = await AntiObsceneGuildIDs.findOne({ guildId });

      if (!isEnabled) {
        return interaction.reply({
          content: 'Anti Obscene is not enabled in this guild.',
          ephemeral: true,
        });
      }
      await AntiObsceneGuildIDs.deleteOne({ guildId });
      return interaction.reply({
        content: 'Successfully removed AntiObscene from this guild.',
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() == 'anti-threat') {
      const guildId = interaction.guild.id;
      const isEnabled = await AntiThreatGuildIDs.findOne({ guildId });

      if (!isEnabled) {
        return interaction.reply({
          content: 'Anti Threat is not enabled in this guild.',
          ephemeral: true,
        });
      }
      await AntiThreatGuildIDs.deleteOne({ guildId });
      return interaction.reply({
        content: 'Successfully removed AntiThreat from this guild.',
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() == 'anti-insult') {
      const guildId = interaction.guild.id;
      const isEnabled = await AntiInsultGuildIDs.findOne({ guildId });

      if (!isEnabled) {
        return interaction.reply({
          content: 'Anti Insult is not enabled in this guild.',
          ephemeral: true,
        });
      }
      await AntiInsultGuildIDs.deleteOne({ guildId });
      return interaction.reply({
        content: 'Successfully removed AntiInsult from this guild.',
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() == 'anti-profanity') {
      const guildId = interaction.guild.id;
      const isEnabled = await antiProfanity.findOne({ guildId });

      if (!isEnabled) {
        return interaction.reply({
          content: 'Anti Profanity is not enabled in this guild.',
          ephemeral: true,
        });
      }
      await antiProfanity.deleteOne({ guildId });
      return interaction.reply({
        content: 'Successfully removed AntiProfanity from this guild.',
        ephemeral: true,
      });
    }
  },
};
