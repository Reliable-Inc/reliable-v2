const { Events, CommandInteraction, Client } = require("discord.js");
const { Configuration } = require("../../config");

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    try {
      if (!interaction.isChatInputCommand()) return;

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
          return interaction.reply({
            content: `This command is developer only.`,
            ephemeral: true,
          });
        }
      }

      try {
        command.execute(interaction, client);
      } catch (e) {
        return interaction.reply({
          content: "There was an error while executing the command",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
};
