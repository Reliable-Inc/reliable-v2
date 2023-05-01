const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Embed
} = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName("exchange")
    .setDescription("Converts one currency to another.")
    .setNSFW(false)
    .addStringOption((op) =>
    op.setName("from").setDescription("The currency you want to convert from.").setRequired(true)
  )
    .addStringOption((op) =>
  op.setName("to").setDescription("The currency you want to convert to.").setRequired(true)
)
    .addIntegerOption((op) =>
op.setName("amount").setDescription("The amount of currency you want to convert.").setRequired(true)
)
.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const from = interaction.options.getString('from');
    const touwu = interaction.options.getString('to');
    const amount = interaction.options.getInteger('amount');

    const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${from}`);
    const data = await response.json();
    const rate = data.rates[touwu];
    const converted = (amount * rate).toFixed(2);

    const CurrencyExchange = new EmbedBuilder()
      .setTitle("Currency")
      .addFields(
        {
          name: "__Exchange Information__",
          value: `**\`•\` Converted**: **\`${converted}\`**`
        }
      )
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
      )
    await interaction.editReply({ embeds: [CurrencyExchange], components: [components], ephemeral: true });
  },
};
