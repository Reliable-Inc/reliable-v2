const { EmbedBuilder } = require("discord.js");
const { Colors } = require("discordjs-colors-bundle");

module.exports = {
  data: {
    name: "announce",
  },

  async execute(interaction, client) {
         const title = interaction.fields.getTextInputValue('title');
      const desc = interaction.fields.getTextInputValue('desc');
      const clr = interaction.fields.getTextInputValue('clr');
      const me = interaction.fields.getTextInputValue('me').toString().toLowerCase();

    const Embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(desc)
      .setColor(Colors[clr] || clr)
      .setFooter({ text: `Announced by ${interaction.user.username}`, icon_url: `${interaction.user.displayAvatarURL()}`})


      if(me == "yes") {
        return interaction.channel.send({ content: `@everyone @here`, embeds: [Embed]}) && interaction.reply({ content: `Announced ${title}`, ephemeral: true });
      } else {
        return interaction.channel.send({ embeds: [Embed]}) && interaction.reply({ content: `Announced ${title}`, ephemeral: true });
      }
  },
};
