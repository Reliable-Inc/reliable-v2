const {
  SlashCommandBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  ModalBuilder,
} = require("discord.js");
module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announce Something!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('announce')
            .setTitle('Announcement Setup Panel');

        const title = new TextInputBuilder()
            .setCustomId('title')
            .setLabel("Announcement Title")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Random Announcement!");
        
        const desc = new TextInputBuilder()
            .setCustomId('desc')
            .setLabel("Announcement Description")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Random Announcement Description, Blah Blah Blah");
        const clr = new TextInputBuilder()
            .setCustomId('clr')
            .setLabel("Embed Color")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Green");
      const me = new TextInputBuilder()
            .setCustomId('me')
            .setLabel("Mention Everyone?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Yes");

        const ActionRow1 = new ActionRowBuilder().addComponents(title);
        const ActionRow2 = new ActionRowBuilder().addComponents(desc);
        const ActionRow3 = new ActionRowBuilder().addComponents(clr);
        const ActionRow4 = new ActionRowBuilder().addComponents(me);
      

        modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4);


    await interaction.showModal(modal);
  },
};
