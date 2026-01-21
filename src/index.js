import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
// import "./database/db.js";
import { getGuild } from "./services/guildService.js";
import { loadCommands, handleCommand } from "./commands/commandHandler.js";
import { loadMessageCommands, handleMessage } from "./handlers/messageHandler.js";
import { loadSlashCommands, handleSlash } from "./handlers/slashHandler.js";
import { checkSpam } from "./services/antiSpamService.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,

  ]
});

// setInterval(() => {
//   try {
//     autoSaveAll();
//     console.log("Pawer: Auto-saved all cached data.");
//   } catch (err) {
//     console.error("Error during auto-save:", err);
//   }
// }, 5 * 60 * 1000); // every 5 minutes

client.once("ready", async () => {
  console.log(`✅Pawer online as ${client.user.tag}`);
  client.guilds.cache.forEach(g => getGuild(g.id));
  await loadMessageCommands();
  await loadSlashCommands(client);
});

client.on("guildCreate", guild => {
  getGuild(guild.id);
});

client.on("messageCreate", async message => {
  handleMessage(message);
});
client.on("interactionCreate", handleSlash);

client.login(process.env.TOKEN);
