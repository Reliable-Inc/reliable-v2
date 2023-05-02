module.exports = {
  data: {
    name: "tst-mnu",
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `You choosed ${interaction.values[0]}`,
    });
  },
};
