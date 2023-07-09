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
         const embed = new EmbedBuilder()
          .setColor('#2F3136')
          .setTitle(`__Verified__`)
          .setDescription(`We are pleased to inform you that your verification process has been successfully completed. Congratulations on achieving verification status, which grants you access to additional privileges and enhanced features.`)
          .setFooter({ text: 'Reliable | Your trusted assistant' }) 

          interaction.reply({ embeds: [embed], ephemeral: true })
      } else {
        const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`__Already Verified__`)
        .setDescription(`We would like to notify you that your verification status is already confirmed. As per our records, you have successfully completed the verification process, granting you access to the associated benefits and privileges.`)
        .setFooter({ text: 'Reliable | Your trusted assistant' }) 

        interaction.reply({ embeds: [embed], ephemeral: true })
      }
    } else {
      const embed = new EmbedBuilder()
      .setColor('#2F3136')
      .setTitle(`__Error__`)
      .setDescription(`We regret to inform you that the verification role has not been assigned in our system. To resolve this matter, we kindly request you to reach out to an administrator for further assistance.`)
      .setFooter({ text: 'Reliable | Your trusted assistant' }) 

      interaction.reply({ embeds: [embed], ephemeral: true })
    }
  },
};
