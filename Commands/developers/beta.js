import {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} from 'discord.js';
import mongoose from 'mongoose';
import * as cb from 'discordjs-colors-bundle';
import BetaTestUsers from '../../Schemas/BetaTest';

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('beta')
    .setDescription('Add or Remove beta test program for a user. (Devs Limited)')
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add a user to the beta test program. (Devs Only)')
        .addUserOption((op) =>
          op
            .setName('user')
            .setDescription('The user you want to add beta.')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Remove a user from the beta test program. (Devs Only)')
        .addUserOption((op) =>
          op
            .setName('user')
            .setDescription('The user you want to remove from beta.')
            .setRequired(true)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() == 'add') {
      const user = interaction.options.getUser('user') ?? interaction.user;
      const SuccessEmbed = new EmbedBuilder()
        .setTitle('__Added__')
        .setDescription(`I'm are pleased to inform you that a new user has been successfully added to the beta test program. This program is specifically designed to evaluate and refine the performance, usability, and functionality of our software or service before its official release to the wider public.`)
        .addFields(
          {
            name: "__User Information__",
            value: `**\`»\` ID**: \`${user.id}\`
**\`»\` Mention**: <@${user.id}>
**\`»\` Tag**: \`${user?.username}\``
          }
        )
        .setColor(`#2F3136`)
        .setFooter({ text: 'Reliable | Your trusted assistant' })

        const bcomponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('torbap')
            .setLabel(`Added by ${interaction.user.username}`)
            .setStyle('Secondary')
            .setDisabled(true)
        );

      const existingUser = await BetaTestUsers.findOne({
        userID:
          typeof user?.id === 'number'
            ? user.id
            : parseInt(user?.id) ?? 1234567890,
      });

      if (existingUser) {
        const exisiting = new EmbedBuilder()
        .setTitle('__Error__')
        .setDescription(`I hereby notify you that I comprehensive database reflects the presence of your distinguished persona within its repository. Following a meticulous examination, it has come to my attention that personal particulars, along with associated information, have been duly recorded and securely stored within our esteemed system.`)
        .setColor(`#2F3136`)
        .setFooter({ text: 'Reliable | Your trusted assistant' })
        interaction.reply({ embeds: [exisiting], ephemeral: true });
        return;
      }

      const newUser = new BetaTestUsers({
        userID:
          typeof user?.id === 'number'
            ? user.id
            : parseInt(user?.id) ?? 1234567890,
        username: user?.username ?? 'Reliable User',
        addedBy: interaction?.user?.username ?? 'Reliable Inc.',
      });

      await newUser.save();
      interaction.reply({ embeds: [SuccessEmbed], components: [bcomponents], ephemeral: true });
    } else if (interaction.options.getSubcommand() == 'remove') {
      const user = interaction.options.getUser('user') ?? interaction.user;
      const SuccessEmbed = new EmbedBuilder()
        .setTitle('__Removed__')
        .setDescription(`I acknowledge and respect your decision to request removal from our esteemed beta testing program. We deeply appreciate your participation thus far and understand that your circumstances or preferences may have changed, leading to your desire to discontinue your involvement.`)
        .addFields(
          {
            name: "__User Information__",
            value: `**\`»\` ID**: \`${user.id}\`
**\`»\` Mention**: <@${user.id}>
**\`»\` Tag**: \`${user?.username}\``
          }
        )
        .setColor(`#2F3136`)
        .setFooter({ text: 'Reliable | Your trusted assistant' })

        const bcomponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('torbap')
            .setLabel(`Removed by ${interaction.user.username}`)
            .setStyle('Secondary')
            .setDisabled(true)
        );

      const existingUser = await BetaTestUsers.findOneAndDelete({
        userID:
          typeof user?.id === 'number'
            ? user.id
            : parseInt(user?.id) ?? 1234567890,
      });

      if (!existingUser) {
        const exisiting = new EmbedBuilder()
        .setTitle('__Error__')
        .setDescription(`We regret to inform you that, as per our extensive database analysis, it has been determined that your esteemed persona is not currently present within our records. In order to proceed with the removal process, it is imperative that we first add your information to our database.`)
        .setColor(`#2F3136`)
        .setFooter({ text: 'Reliable | Your trusted assistant' })
        interaction.reply({ embeds: [exisiting], ephemeral: true });
        return;
      }

      interaction.reply({ embeds: [SuccessEmbed], components: [bcomponents], ephemeral: true });
    }
  },
};
