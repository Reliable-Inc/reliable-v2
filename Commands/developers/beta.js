import {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import mongoose from 'mongoose';
import * as cb from 'discordjs-colors-bundle';
import BetaTestUsers from '../../Schemas/BetaTest';

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('beta')
    .setDescription('Beta test')
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add a user to the beta test program')
        .addUserOption((op) =>
          op
            .setName('user')
            .setDescription('The user you want to add beta.')
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Remove a user from the beta test program')
        .addUserOption((op) =>
          op
            .setName('user')
            .setDescription('The user you want to remove from beta.')
            .setRequired(true),
        ),
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() == 'add') {
      const user = interaction.options.getUser('user') ?? interaction.user;
      const SuccessEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(
          `Successfully added <@${user?.username}> to the beta test program!`,
        )
        .setFooter({ text: `Beta test added by ${interaction.user.username}` })
        .setColor(cb.Colors['SpringGreen']);

      const existingUser = await BetaTestUsers.findOne({
        userID:
          typeof user?.id === 'number'
            ? user.id
            : parseInt(user?.id) ?? 1234567890,
      });

      if (existingUser) {
        interaction.reply({
          content: 'User is already in the database',
          ephemeral: true,
        });
        return;
      }

      const newUser = new BetaTestUsers({
        userID:
          typeof user?.id === 'number'
            ? user.id
            : parseInt(user?.id) ?? 1234567890,
        username: user?.username ?? 'Daddy',
        addedBy: interaction?.user?.username ?? 'GayAlpha',
      });

      await newUser.save();
      interaction.reply({ embeds: [SuccessEmbed], ephemeral: true });
    } else if (interaction.options.getSubcommand() == 'remove') {
      const user = interaction.options.getUser('user') ?? interaction.user;
      const SuccessEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(
          `Successfully removed <@${user?.username}> from the beta test program!`,
        )
        .setFooter({
          text: `Beta test removed by ${interaction.user.username}`,
        })
        .setColor(cb.Colors['SpringGreen']);

      const existingUser = await BetaTestUsers.findOneAndDelete({
        userID:
          typeof user?.id === 'number'
            ? user.id
            : parseInt(user?.id) ?? 1234567890,
      });

      if (!existingUser) {
        interaction.reply(
          'The user is not in the database, add them first in order to remove.',
        );
        return;
      }

      interaction.reply({ embeds: [SuccessEmbed] });
    }
  },
};
