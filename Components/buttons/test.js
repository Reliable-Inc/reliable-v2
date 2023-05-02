module.exports = {
  data: {
    name: "tst-btn",
  },

  async execute(interaction) {
    await interaction.reply({ content: "Hello!", ephemeral: true });
  },
};
