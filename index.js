require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config.json");
const PocketBase = require("pocketbase/cjs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const pb = new PocketBase(process.env.DATABASE);

client.login(process.env.BOT_TOKEN);

client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  const channel = client.channels.cache.get(message.channelId);
  if (message.content.startsWith("!")) {
    channel.send("elo");
  }
});
