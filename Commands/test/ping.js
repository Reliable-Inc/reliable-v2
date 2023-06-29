const {
  CommandInteraction,
  EmbedBuilder,
  Client,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { CustomHex } = require("discordjs-colors-bundle");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("botping")
    .setDescription("Returns bot ping")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Commands - Developer")
      .setDescription(
        `> Oops, it looks like there was an error while executing that command. Here are some possible reasons why this happened:

**\`•\`** The bot encountered an unexpected issue while trying to process your command.
**\`•\`** The command was used incorrectly or with invalid input.
**\`•\`** The bot does not have the necessary permissions to perform that action.
        
__If you continue to experience issues, please reach out to the bot's developers for assistance. Thank you!__`
      )
      .setColor(CustomHex("#2F3136"))
      .setFooter({ text: "©2022 - 2023 | Reliable" });

    const topgg = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Vote Reliable")
        .setEmoji("<:reliable_topgg:1034324522305855561>")
        .setStyle("Link")
        .setURL("https://top.gg/bot/1030870443005071512?s=05fa7c98112c0"),
      new ButtonBuilder()
        .setLabel("Support Server")
        .setEmoji("<:reliable_support:1031443305399074836>")
        .setStyle(ButtonStyle.Link)
        .setURL("https://dsc.gg/reliable-support"),
      new ButtonBuilder()
        .setLabel("Invite Reliable")
        .setEmoji("<:reliable_invite:1031443216664371231>")
        .setStyle("Link")
        .setURL("https://dsc.gg/reliable-bot")
    );
    await interaction.reply({
      embeds: [embed],
      components: [topgg],
      ephemeral: true,
    });
  },
};
