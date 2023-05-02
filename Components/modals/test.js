module.exports = {
  data: {
    name: "myModal",
  },

  async execute(interaction, client) {
    await interaction.reply({
      content: `You said your fav color is ${interaction.fields.getTextInputValue(
        "favclr"
      )}`,
    });
  },
};
