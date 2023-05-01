const { Events, CommandInteraction, Client } = require("discord.js");

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

      command.execute(interaction, client);
    } catch (e) {
      console.error(e);
    }
  },
};
