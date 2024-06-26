const { showList } = require("../../utils.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lista")
    .setDescription("Wyświetla listę graczy."),
  async execute(interaction) {
    await interaction.deferReply();
    const list = await showList();
    await interaction.editReply(list);
  },
};
