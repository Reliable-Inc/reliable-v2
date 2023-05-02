const {
  CommandInteraction,
  EmbedBuilder,
  Client,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Configuration } = require("../../config");
const chalk = require("chalk");

module.exports = {
  name: Events.InteractionCreate,
  once: false,

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          interaction.reply({
            content: "Invalid Command",
            ephemeral: true,
          });
        }

        if (command.developer) {
          const developerIds = Configuration.developerIds;
          if (!developerIds.includes(interaction.user.id)) {
            console.log(
              chalk.cyan("[ INFORMATION ]") +
                chalk.white.bold(" | ") +
                chalk.blue(`${new Date().toLocaleDateString()}`) +
                chalk.white.bold(" | ") +
                chalk.cyan("Someone tried to use developer command") +
                chalk.white(": ") +
                chalk.greenBright(
                  `${interaction.user.tag} | ${interaction.user.id}`
                )
            );

            const embed = new EmbedBuilder()
              .setTitle("Commands - Developer")
              .setDescription(
                "> **Sorry, you do not have permission to use this command. This command is intended only for developers and requires special access. If you believe you should have access to this command, please contact the bot owner for further assistance. Thank you for your understanding.**"
              )
              .setColor("#2F3136")
              .setFooter({ text: "©2022 - 2023 | Reliable" });

            const topgg = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Vote Reliable")
                .setEmoji("<:reliable_topgg:1034324522305855561>")
                .setStyle("Link")
                .setURL(
                  "https://top.gg/bot/1030870443005071512?s=05fa7c98112c0"
                ),
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
            return interaction.reply({
              embeds: [embed],
              components: [topgg],
              ephemeral: true,
            });
          }
        }

        try {
          await command.execute(interaction, client);
        } catch (e) {
          const embed = new EmbedBuilder()
            .setTitle("Commands - Developer")
            .setDescription(
              `> Oops, it looks like there was an error while executing that command. Here are some possible reasons why this happened:
  
  **\`•\`** The bot encountered an unexpected issue while trying to process your command.
  **\`•\`** The command was used incorrectly or with invalid input.
  **\`•\`** The bot does not have the necessary permissions to perform that action.
          
  __If you continue to experience issues, please reach out to the bot's developers for assistance. Thank you!__`
            )
            .setColor("#2F3136")
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
          return interaction.reply({
            embeds: [embed],
            components: [topgg],
            ephemeral: true,
          });
        }
      } else if (interaction.isButton()) {
        const { buttons } = client;
        const { customId } = interaction;

        const button = buttons.get(customId);

        if (!button) return new Error("There is no code for the button.");

        try {
          await button.execute(interaction, client);
        } catch (e) {
          console.error(e.message);
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
};
