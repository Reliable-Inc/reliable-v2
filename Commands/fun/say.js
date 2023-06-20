const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const list = require('badwords-list');
const words = require('./bad-words.json');
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
} = require('discord.js');
const { CustomHex } = require('discordjs-colors-bundle');
const cooldown = new CommandCooldown('earnCash', ms('50s'));

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription("Replies with what you've said.")
    .addStringOption((op) =>
      op
        .setName('message')
        .setDescription('The message to say.')
        .setRequired(true)
    ),

  /**
   * Execute the "say" command.
   * @param {ChatInputCommandInteraction} interaction The interaction instance.
   * @param {Client} client The client instance.
   */
  async execute(interaction, client) {
    const userCooldowned = await cooldown.getUser(interaction.user.id);

    if (userCooldowned) {
      const timeLeft = msToMinutes(userCooldowned.msLeft, false);
      return interaction.reply({
        content: `You are in a cooldown. Time left: ${timeLeft.seconds}`,
      });
    }
    const toSay = interaction.options.getString('message');
    const excludedWords = ['Hello'];
    // Check for bad words
    const badWords = Object.values(words.words).concat(list.array);
    if (
      badWords.some(
        (word) =>
          toSay.toLowerCase().includes(word) && !excludedWords.includes(word)
      )
    ) {
      const embed = new EmbedBuilder()
        .setTitle('Say - Warning')
        .setColor(CustomHex('#2F3136'))
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setDescription(
          `**<:reliable_wrong:1043155193077960764> | \`Please watch your language! Your message contains inappropriate words.\`**`
        )
        .addFields({
          name: '__The Bad Word__',
          value: `||**\`${toSay}\`**||`,
        });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (toSay.includes('@')) {
      const embed = new EmbedBuilder()
        .setTitle('Say - Warning')
        .setColor('#2F3136')
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setDescription(
          `**<:reliable_wrong:1043155193077960764> | \`Sorry, but you cannot send messages with mentions.\`**`
        );

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    try {
      await interaction.channel.send(toSay);
      const embed = new EmbedBuilder()
        .setTitle('Say - Send')
        .setColor('#2F3136')
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setDescription(`*❝${toSay}🙷* - __**${interaction.user.tag}**__`)
        .addFields({
          name: '__Status__',
          value: `<:reliable_right:1042843202429919272> **\`Successfully sent.\`**`,
        });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setTitle('Say - Error')
        .setColor('#2F3136')
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setDescription(
          `<:reliable_wrong:1043155193077960764> | **\`Sorry, an error occurred while trying to send your message.\`**`
        )
        .addFields({
          name: '__Status__',
          value: `**\`Successfully sent.\`**`,
        });

      return (
        interaction.reply({ embeds: [embed], ephemeral: true }) &&
        (await cooldown.addUser(interaction.user.id))
      );
    }
  },
};
