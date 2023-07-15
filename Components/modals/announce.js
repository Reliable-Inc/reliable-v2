const { EmbedBuilder } = require('discord.js');
const { Colors } = require('discordjs-colors-bundle');

module.exports = {
  data: {
    name: 'announce',
  },

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const title = interaction.fields.getTextInputValue('title');
    const desc = interaction.fields.getTextInputValue('desc');
    const clr = interaction.fields.getTextInputValue('clr');
    const me = interaction.fields
      .getTextInputValue('me')
      .toString()
      .toLowerCase();

    const Embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(desc)
      .setColor(Colors[clr] || clr)
      .setFooter({
        text: `Announced by ${interaction.user.username}`,
        icon_url: `${interaction.user.displayAvatarURL()}`,
      });

    if (me == 'yes') {
      interaction.channel.send({
        content: `@everyone @here`,
        embeds: [Embed],
      });

      const embed = new EmbedBuilder()
        .setColor(`#2F3136`)
        .setFooter({ text: 'Reliable | Your trusted assistant' })
        .setTitle('__Announced__')
        .setDescription(
          `We are pleased to inform you that we will be making an important announcement in the near future. The purpose of this correspondence is to provide you with an initial notification, allowing you to anticipate and prepare for the forthcoming announcement.`
        );

      interaction.editReply({ embeds: [embed], ephemeral: true });
    } else {
      interaction.channel.send({ embeds: [Embed] });
      const embed = new EmbedBuilder()
        .setColor(`#2F3136`)
        .setFooter({ text: 'Reliable | Your trusted assistant' })
        .setTitle('__Announced__')
        .setDescription(
          `We are pleased to inform you that we will be making an important announcement in the near future. The purpose of this correspondence is to provide you with an initial notification, allowing you to anticipate and prepare for the forthcoming announcement.`
        );

     return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  },
};
