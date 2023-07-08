const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Embed,
} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("hostevent")
    .setDescription("Using this command you can host your own events.")
    .setNSFW(false)
    .addStringOption((op) =>
      op
        .setName("event")
        .setDescription("What kind of event you want to host?")
        .setRequired(true)
        .addChoices(
            { name: 'Patrol', value: 'patrol' },
            { name: 'Trial', value: 'trial' },
            { name: 'General Training', value: 'general_training' },
            { name: 'Combat Training', value: 'combat_training' },
            { name: 'Inspections', value: 'inspections' },
            { name: 'Tryout', value: 'tryout' },
			)
    )
    .addStringOption((op) =>
      op
        .setName("time")
        .setDescription("When the event will start?")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("link")
        .setDescription("Link to the event.")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("note")
        .setDescription("Any important thing?")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const event = interaction.options.getString("event");
    const time = interaction.options.getString("time");
    const link = interaction.options.getString("link");
    const note = interaction.options.getString("note") || "None";

    const event2 = new EmbedBuilder()
      .setTitle("Currency")
      .addFields({
        name: "__Exchange Information__",
        value: `**\`•\` Converted**: **\`${converted}\`**`,
      })
      .setColor("#2F3136")
      .setFooter({ text: "©2022 - 2023 | Reliable" })
      .setTimestamp();

    const components = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("YES")
        .setLabel(`From: ${from}`)
        .setStyle("Secondary")
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("NO")
        .setLabel(`To: ${touwu}`)
        .setStyle("Secondary")
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("NOw")
        .setLabel(`Amount: ${amount}`)
        .setStyle("Secondary")
        .setDisabled(true)
    );
    await interaction.editReply({
      embeds: [CurrencyExchange],
      components: [components],
      ephemeral: true,
    });
  },
};
