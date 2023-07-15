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
  beta: true,
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup command.')
    .addSubcommand(sub =>
      sub
        .setName('verification')
        .setDescription('Setup verification for your server.')
        .addRoleOption(op =>
          op
            .setName('role')
            .setDescription('The verified role')
            .setRequired(true)
        )
        .addChannelOption(op =>
          op
            .setName('channel')
            .setDescription('The channel to send the verification embed')
            .setRequired(true)
        )
        .addStringOption(op =>
          op
            .setName('embed-title')
            .setDescription('The embed title for your verification embed.')
            .setRequired(false)
        )
        .addStringOption(op =>
          op
            .setName('description')
            .setDescription('The description of the embed')
            .setRequired(false)
        )
        .addStringOption(op =>
          op
            .setName('footer')
            .setDescription('The embed footer')
            .setRequired(false)
        )
        .addStringOption(op =>
          op
            .setName('image')
            .setDescription('Any image you need for the embed?')
            .setRequired(false)
        )
        .addStringOption(op =>
          op
            .setName('color')
            .setDescription('The color for the embed.')
            .setRequired(false)
        )
        .addStringOption(op =>
          op
            .setName('button-name')
            .setDescription('The name of the button.')
            .setRequired(false)
        )
        .addStringOption(op =>
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
        .addStringOption(op =>
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
      const title = interaction.options.getString('embed-title');
      const description = interaction.options.getString('description');
      const footerText = interaction.options.getString('footer');
      const color = interaction.options.getString('color') ?? '#2F3136';
      const image = interaction.options.getString('image') ?? 0;
      const channelId = interaction.options.getChannel('channel').id;
      const channel = client?.channels.cache.get(channelId);
      const role = interaction?.guild.roles.cache.find(r => r.name === roleId);
      const btnColor =
        interaction?.options.getString('button-color') ?? 'secondary';
      const btnTitle =
        interaction?.options.getString('button-name') ?? 'Verification';
      const btnEmoji =
        interaction?.options.getString('button-emoji') ??
        '<:reliable_right:1042843202429919272>';
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
          .setTitle(`${title || `Verification for ${interaction.guild.name}`}`)
          .setDescription(
            `${
              description ||
              'We kindly invite you to click the grey button provided below to acquire the coveted role mentioned subsequently. This esteemed role will grant you access to exclusive privileges and enhanced functionalities within our community. By initiating this action, you will embark upon a journey of elevated engagement and enriched experiences. Seize the opportunity to unlock the potential that awaits you.'
            }`
          )
          .setFooter({
            text: `${footerText || 'Reliable | Your trusted assistant'}`,
          })
          .addFields({
            name: '__Role__',
            value: `**\`»\`** <@&${roleId}>`,
          })
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
          .setTitle(`${title || `Verification for ${interaction.guild.name}`}`)
          .addFields({
            name: '__Role__',
            value: `**\`»\`** <@&${roleId}>`,
          })
          .setDescription(
            `${
              description ||
              'We kindly invite you to click the grey button provided below to acquire the coveted role mentioned subsequently. This esteemed role will grant you access to exclusive privileges and enhanced functionalities within our community. By initiating this action, you will embark upon a journey of elevated engagement and enriched experiences. Seize the opportunity to unlock the potential that awaits you.'
            }`
          )
          .setFooter({
            text: `${footerText || 'Reliable | Your trusted assistant'}`,
          })
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
