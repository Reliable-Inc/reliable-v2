const {
  SlashCommandBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  ModalBuilder,
} = require('discord.js');
module.exports = {
  developer: false,
  beta: false,
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Announce anything with embed by using it.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId('announce')
      .setTitle('Announcement - Setup');

    const title = new TextInputBuilder()
      .setCustomId('title')
      .setLabel('Announcement Title')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Title of your announcement.');

    const desc = new TextInputBuilder()
      .setCustomId('desc')
      .setLabel('Announcement Description')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Write your news description here.');
    const clr = new TextInputBuilder()
      .setCustomId('clr')
      .setLabel('Embed Color')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex. Green');
    const me = new TextInputBuilder()
      .setCustomId('me')
      .setLabel('Do you want to mention everyone?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('No/Yes (Ex. Yes)');

    const ActionRow1 = new ActionRowBuilder().addComponents(title);
    const ActionRow2 = new ActionRowBuilder().addComponents(desc);
    const ActionRow3 = new ActionRowBuilder().addComponents(clr);
    const ActionRow4 = new ActionRowBuilder().addComponents(me);

    modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4);

    await interaction.showModal(modal);
  },
};
