import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { Colors } from 'discordjs-colors-bundle';
import VerificationRole from '../../Schemas/VerificationSchema';

let roleId = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup command.')
    .addSubcommand((sub) =>
      sub
        .setName('verification')
        .setDescription('Setup verification for your server.')
        .addRoleOption((op) =>
          op
            .setName('role')
            .setDescription('The verified role')
            .setRequired(true)
        )
        .addChannelOption((op) =>
          op
            .setName('channel')
            .setDescription('The channel to send the verification embed')
            .setRequired(true)
        )
        .addStringOption((op) =>
          op
            .setName('embed-title')
            .setDescription('The embed title for your verification embed.')
            .setRequired(false)
        )
        .addStringOption((op) =>
          op
            .setName('description')
            .setDescription('The description of the embed')
            .setRequired(false)
        )
        .addStringOption((op) =>
          op
            .setName('footer')
            .setDescription('The embed footer')
            .setRequired(false)
        )
        .addStringOption((op) =>
          op
            .setName('image')
            .setDescription('Any image you need for the embed?')
            .setRequired(false)
        )
        .addStringOption((op) =>
          op
            .setName('color')
            .setDescription('The color for the embed.')
            .setRequired(false)
        )
        .addStringOption((op) =>
          op
            .setName('button-name')
            .setDescription('The name of the button.')
            .setRequired(false)
        )
        .addStringOption((op) =>
          op
            .setName('button-color')
            .setDescription('The color for the button.')
            .addChoices(
              { name: 'Green', value: 'success' },
              { name: 'Blue', value: 'primary' },
              { name: 'Gray', value: 'secondary' },
              { name: 'Red', value: 'danger' }
            )
            .setRequired(false)
        )
        .addStringOption((op) =>
          op
            .setName('button-emoji')
            .setDescription('The emoji for the button.')
            .setRequired(false)
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() == 'verification') {
      roleId = interaction.options.getRole('role').id;
      const title =
        interaction.options.getString('embed-title') ??
        `${interaction.guild.name} - Verification`;
      const description =
        interaction.options.getString('description') ??
        `Click the button below to get the <@&${roleId}> role`;
      const footerText =
        interaction.options.getString('footer') ?? `${interaction.guild.name}`;
      const color = interaction.options.getString('color') ?? 'SpringGreen';
      const image = interaction.options.getString('image') ?? 0;
      const channelId = interaction.options.getChannel('channel').id;
      const channel = client?.channels.cache.get(channelId);
      const role = interaction?.guild.roles.cache.find(
        (r) => r.name === roleId
      );
      const btnColor =
        interaction?.options.getString('button-color') ?? 'success';
      const btnTitle =
        interaction?.options.getString('button-name') ?? 'Verify';
      const btnEmoji = interaction?.options.getString('button-emoji') ?? '✅';
      // RoleMap.set('roleId', roleId);
      const guildId = interaction?.guild.id;
      const Embed = new EmbedBuilder();
      const button = new ButtonBuilder()
        .setCustomId('verifyBtn')
        .setLabel(btnTitle)
        .setEmoji(btnEmoji);

      const existingRole = await VerificationRole.findOne({ guildId });

      if (existingRole) {
        existingRole.roleId = roleId;
        await existingRole.save();
      } else {
        const newRole = new VerificationRole({ guildId, roleId });
        await newRole.save();
      }

      if (image) {
        Embed.setColor(Colors[color] || color)
          .setTitle(title)
          .setDescription(description)
          .setFooter({ text: footerText })
          .setImage(image)
          .setTimestamp();
        if (btnColor === 'success') {
          button.setStyle(ButtonStyle.Success);
        } else if (btnColor === 'danger') {
          button.setStyle(ButtonStyle.Danger);
        } else if (btnColor === 'primary') {
          button.setStyle(ButtonStyle.Primary);
        } else {
          button.setStyle(ButtonStyle.Secondary);
        }

        const buttons = new ActionRowBuilder().addComponents(button);

        return channel.send({ embeds: [Embed], components: [buttons] });
      } else {
        Embed.setColor(Colors[color] || color)
          .setTitle(title)
          .setDescription(description)
          .setFooter({ text: footerText })
          .setTimestamp();
        if (btnColor === 'success') {
          button.setStyle(ButtonStyle.Success);
        } else if (btnColor === 'danger') {
          button.setStyle(ButtonStyle.Danger);
        } else if (btnColor === 'primary') {
          button.setStyle(ButtonStyle.Primary);
        } else {
          button.setStyle(ButtonStyle.Secondary);
        }

        const buttons = new ActionRowBuilder().addComponents(button);

        return channel.send({ embeds: [Embed], components: [buttons] });
      }
    }
  },
};

export default roleId;
