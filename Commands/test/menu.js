const {
  SlashCommandBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Returns menu")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId("tst-mnu")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        new StringSelectMenuOptionBuilder({ label: "Idk", value: "idk" }),
        new StringSelectMenuOptionBuilder({
          label: "UIDUI",
          value: "yugiuDigf",
        })
      );
    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({ content: `Menu`, components: [row] });
  },
};
