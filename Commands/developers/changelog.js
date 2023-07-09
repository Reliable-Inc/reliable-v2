const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changelogs")
    .setDescription("Request to access detailed bot changelogs for your perusal."),
  async execute(interaction, client) {
    const channelId = "1029807544505466971";
    try {
      const channel = await client.channels.fetch(channelId);

      channel.messages.fetch().then(messages => {
        if (!messages.size) {
          const exisiting = new EmbedBuilder()
          .setTitle('__Error__')
          .setDescription(`We regret to inform you that upon conducting a thorough search in the designated channel, no announcements have been found at this time. We understand the importance of receiving up-to-date and relevant information, and we apologize for any inconvenience caused by the absence of recent updates in the specified channel. Rest assured, our team remains dedicated to keeping our users informed and will continue to share pertinent announcements as soon as they become available. Thank you for your understanding and patience.`)
          .setColor(`#2F3136`)
          .setFooter({ text: 'Reliable | Your trusted assistant' })
          interaction.reply({ embeds: [exisiting], ephemeral: true });
        }

        const latestMessage = messages.first();

        let response;
        if (latestMessage.embeds.length) {
          const embed = latestMessage.embeds[0];

          response = {
            embeds: [embed],
            ephemeral: true
          };
        } else {
          const embed = new EmbedBuilder()
            .setTitle("__Latest Changelogs__")
            .setDescription(latestMessage.content)
            .setColor(`#2F3136`)
            .setFooter({ text: 'Reliable | Your trusted assistant' })
            .setTimestamp(latestMessage.createdTimestamp);
          response = {
            embeds: [embed],
            ephemeral: true
          };
        }

        interaction.reply(response);
      });
    } catch (error) {
      console.error("An error occurred:", error);
      const embed1 = new EmbedBuilder()
      .setColor(`#2F3136`)
      .setFooter({ text: 'Reliable | Your trusted assistant' })
      .setTitle('Error | 500 Internal Server')
      .setDescription(
        `<:reliable_dnd:1044914867779412078> | The server encountered an unexpected condition that prevented it from fulfilling the request. It is an internal error on the server side, typically caused by misconfigurations, software bugs, or server overload. Users should contact the server administrator for resolution.`
      );

    console.log(e);

    return interaction.reply({ embeds: [embed1], ephemeral: true });
    }
  } 
};
