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
    .setDescription("Some thing.. That.. Extremely Sus.")
    .setNSFW(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const image = await nsfw.hentai();
    const hentaiimg = new EmbedBuilder()
    .setColor("#2F3136")
    .setFooter({ text: "©2022 - 2023 | Reliable" })
    .setTimestamp()
    .setTitle("`👀` | Sir.. Sir..!, SIR!")
    .setImage(image);

    await interaction.reply({ embeds: [hentaiimg] });
  },
};
