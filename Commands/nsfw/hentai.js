const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
} = require("discord.js");
const { colors } = require("discordjs-colors-bundle");
const NSFW = require("discord-nsfws");
const nsfw = new NSFW();

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("hentai")
    .setDescription("Hentai command only for developers :>")
    .setNSFW(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const image = await nsfw.hentai();

    const HentaiImg = new EmbedBuilder()
      .setColor(colors.MikadoYellow)
      .setTitle("👀")
      .setImage(image);

    await interaction.reply({ embeds: [HentaiImg] });
  },
};