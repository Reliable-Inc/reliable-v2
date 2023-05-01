const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { colors } = require("discordjs-colors-bundle");

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responses with bot ping")
    .setNSFW(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const sentTimeStamp = Date.now();
    await interaction.deferReply({ content: "Pinging...", ephemeral: true });

    const msgPing = Date.now() - sentTimeStamp;
    const PongEmbed = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(
        `Websocket Ping: ${client.ws.ping}\nClient Ping: ${msgPing}`
      )
      .setColor(colors.WildWatermelon)
      .setFooter({ text: interaction.guild.name })
      .setTimestamp();

    await interaction.editReply({ embeds: [PongEmbed], ephemeral: true });
  },
};
