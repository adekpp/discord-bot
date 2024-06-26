const { db } = require("../../db.js");
const { removeFromList, checkAndCreateUser } = require("../../utils.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nie-gram")
    .setDescription("Usuwa gracza z listy"),
  async execute(interaction) {
    await interaction.deferReply();
    const { id: discordId, globalName: username } = interaction.user;
    console.log(interaction.user);
    await checkAndCreateUser(discordId, username);
    const reply = await removeFromList(discordId, username);
    await interaction.editReply(reply);
  },
};
