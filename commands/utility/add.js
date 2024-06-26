const { addToList, checkAndCreateUser } = require("../../utils.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gram")
    .setDescription("Dodaje gracza do listy"),
  async execute(interaction) {
    await interaction.deferReply();
    const { id: discordId, globalName: username } = interaction.user;
    console.log(interaction.user);
    await checkAndCreateUser(discordId, username);
    const reply = await addToList(discordId, username);
    await interaction.editReply(reply);
  },
};
