const { EmbedBuilder, Client, ModalSubmitInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js") 
const { CustomRGB } = require("discordjs-colors-bundle");

module.exports = {
  data: {
    name: "bm",
  },

  /** 
  * @param {ModalSubmitInteraction} interaction
  * @param {Client} client
  */
  async execute(interaction, client) {

    const channel = client?.channels.cache.get("1102477452439203881");
    const Embed = new EmbedBuilder()
    .setTitle("__Program Submission__")
    .setColor(CustomRGB(79, 97, 102))
    .setFooter({ text: "Reliable | Your trusted assistant" })
    .setDescription(`We kindly request to be considered for participation in the beta program. We are eager to contribute our insights, feedback, and expertise to assist in refining and enhancing the product. By actively engaging in the beta program, we aim to collaborate closely with the development team to ensure the delivery of a high-quality and user-centric final release.`) 
     .addFields(
       {
         name: "__Reason__",
         value: `\`\`\`${interaction.fields.getTextInputValue("justWHY")}\`\`\``
       }
     )
   const bcomponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("torbap")
            .setLabel(`Username: ${interaction.fields.getTextInputValue("userName") || interaction.user.username} `)
            .setStyle("Danger")
            .setDisabled(true)) 
    
       await channel.send({ embeds: [Embed], components: [bcomponents] });
  },
};
