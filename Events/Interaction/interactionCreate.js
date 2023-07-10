const {
  CommandInteraction,
  EmbedBuilder,
  Client,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionType,
} = require('discord.js');
const Configuration = require('../../config');
const chalk = require('chalk');
const { CustomHex, CustomRGB } = require('discordjs-colors-bundle');
import BetaTestUsers from '../../Schemas/BetaTest';

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
            content: 'Invalid Command',
            ephemeral: true,
          });
        }

        if (command.developer) {
          const developerIds = Configuration.default.developerIds;
          if (!developerIds.includes(interaction.user.id)) {
            console.log(
              chalk.cyan('[ INFORMATION ]') +
                chalk.white.bold(' | ') +
                chalk.blue(`${new Date().toLocaleDateString()}`) +
                chalk.white.bold(' | ') +
                chalk.cyan('Someone tried to use developer command') +
                chalk.white(': ') +
                chalk.greenBright(
                  `${interaction.user.tag} | ${interaction.user.id}`
                )
            );

            const embed = new EmbedBuilder()
              .setTitle('__Commands Developer__')
              .setDescription(
                '<:reliable_dnd:1044914867779412078> | Sorry, you do not have permission to use this command. This command is intended only for developers and requires special access. If you believe you should have access to this command, please contact the bot owner for further assistance. Thank you for your understanding.'
              )
              .setColor(CustomHex('#2F3136'))
              .setFooter({ text: 'Reliable | Your trusted assistant' });

            const topgg = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel('Vote Reliable')
                .setEmoji('<:reliable_topgg:1034324522305855561>')
                .setStyle('Link')
                .setURL(
                  'https://top.gg/bot/1030870443005071512?s=05fa7c98112c0'
                ),
              new ButtonBuilder()
                .setLabel('Support Server')
                .setEmoji('<:reliable_support:1031443305399074836>')
                .setStyle(ButtonStyle.Link)
                .setURL('https://dsc.gg/reliable-support'),
              new ButtonBuilder()
                .setLabel('Invite Reliable')
                .setEmoji('<:reliable_invite:1031443216664371231>')
                .setStyle('Link')
                .setURL('https://dsc.gg/reliable-bot')
            );
            return interaction.reply({
              embeds: [embed],
              components: [topgg],
              ephemeral: true,
            });
          }
        } else if (command.beta) {
          const userID = interaction.user.id;

          const existingUser = await BetaTestUsers.findOne({ userID });

          if (!existingUser) {
            const applyEmbed = new EmbedBuilder()
              .setTitle('__Beta Program__')
              .setDescription(
                'To begin the process, we kindly request that you utilize the </apply-beta:1127199163793297408> command to submit your application for the beta program. This formal procedure ensures a comprehensive evaluation of your qualifications and compatibility. Thank you for your interest; we look forward to reviewing your application promptly.'
              )
              .setColor(`#2F3136`)
              .setFooter({ text: 'Reliable | Your trusted assistant' });
            const topgg = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel('Vote Reliable')
                .setEmoji('<:reliable_topgg:1034324522305855561>')
                .setStyle('Link')
                .setURL(
                  'https://top.gg/bot/1030870443005071512?s=05fa7c98112c0'
                ),
              new ButtonBuilder()
                .setLabel('Support Server')
                .setEmoji('<:reliable_support:1031443305399074836>')
                .setStyle(ButtonStyle.Link)
                .setURL('https://dsc.gg/reliable-support'),
              new ButtonBuilder()
                .setLabel('Invite Reliable')
                .setEmoji('<:reliable_invite:1031443216664371231>')
                .setStyle('Link')
                .setURL('https://dsc.gg/reliable-bot')
            );
            return interaction.reply({
              embeds: [applyEmbed],
              components: [topgg],
              ephemeral: true,
            });
          }
        }

        try {
          await command.execute(interaction, client);
        } catch (e) {
          const embed = new EmbedBuilder()
            .setTitle(`__System Halt__`)
            .setDescription(
              `Oops, it looks like there was an error while executing that command. Here are some possible reasons why this happened:
  
  **\`•\`** The bot encountered an unexpected issue while trying to process your command.
  **\`•\`** The command was used incorrectly or with invalid input.
  **\`•\`** The bot does not have the necessary permissions to perform that action.
          
  __If you continue to experience issues, please reach out to the bot's developers for assistance. Thank you!__`
            )
            .setColor(CustomHex('#2F3136'))
            .setFooter({ text: 'Reliable | Your trusted assistant' });

          const topgg = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel('Vote Reliable')
              .setEmoji('<:reliable_topgg:1034324522305855561>')
              .setStyle('Link')
              .setURL('https://top.gg/bot/1030870443005071512?s=05fa7c98112c0'),
            new ButtonBuilder()
              .setLabel('Support Server')
              .setEmoji('<:reliable_support:1031443305399074836>')
              .setStyle(ButtonStyle.Link)
              .setURL('https://dsc.gg/reliable-support'),
            new ButtonBuilder()
              .setLabel('Invite Reliable')
              .setEmoji('<:reliable_invite:1031443216664371231>')
              .setStyle('Link')
              .setURL('https://dsc.gg/reliable-bot')
          );
          return (
            interaction.reply({
              embeds: [embed],
              components: [topgg],
              ephemeral: true,
            }) && console.error(e)
          );
        }
      } else if (interaction.isButton()) {
        const { buttons } = client;
        const { customId } = interaction;

        const button = buttons.get(customId);

        if (!button) return new Error('There is no code for the button.');

        try {
          await button.execute(interaction, client);
        } catch (e) {
          console.error(e);
        }
      } else if (interaction.isAnySelectMenu()) {
        const { selectMenus } = client;
        const { customId } = interaction;

        const menu = selectMenus.get(customId);

        if (!menu) return new Error('There is no code for the menu.');

        try {
          await menu.execute(interaction, client);
        } catch (e) {
          console.error(e);
        }
      } else if (interaction.type == InteractionType.ModalSubmit) {
        const { modals } = client;
        const { customId } = interaction;

        const modal = modals.get(customId);

        if (!modal) return new Error('There is no code for the modal.');

        try {
          await modal.execute(interaction, client);
        } catch (e) {
          console.error(e);
        }
      } else if (interaction.isContextMenuCommand()) {
        const { commands } = client;
        const { commandName } = interaction;

        const contextCommand = commands.get(commandName);

        if (!contextCommand) return;

        try {
          contextCommand.execute(interaction, client);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
};
