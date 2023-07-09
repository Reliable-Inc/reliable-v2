import { ButtonInteraction } from 'discord.js';
import VerificationRole from '../../Schemas/VerificationSchema';

module.exports = {
  data: {
    name: 'verifyBtn',
  },

  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const existingRole = await VerificationRole.findOne({ guildId });

    if (existingRole) {
      const roleId = existingRole.roleId;
      const member = await interaction.guild.members.fetch(interaction.user.id);

      if (!member.roles.cache.has(roleId)) {
        member.roles.add(roleId);
        interaction.reply({
          content: 'You have been verified!',
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: 'You are already verified!',
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({
        content: 'Verification role not set. Contact an admin.',
        ephemeral: true,
      });
    }
  },
};
