import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import "./database/db.js";
import { loadGuild } from "./services/guildService.js";
import { autoSaveAll } from "./services/userService.js";
import { loadCommands, handleCommand } from "./commands/commandHandler.js";
import { loadMessageCommands, handleMessage } from "./handlers/messageHandler.js";
import { loadSlashCommands, handleSlash } from "./handlers/slashHandler.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,

  ]
});

setInterval(() => {
  try {
    autoSaveAll();
    console.log("Pawer: Auto-saved all cached data.");
  } catch (err) {
    console.error("Error during auto-save:", err);
  }
}, 5 * 60 * 1000); // every 5 minutes

client.once("ready", async () => {
  console.log(`✅Pawer online as ${client.user.tag}`);
  client.guilds.cache.forEach(g => loadGuild(g.id));
   await loadMessageCommands();
  await loadSlashCommands(client);
});

client.on("guildCreate", guild => {
  loadGuild(guild.id);
});

client.on("messageCreate", handleMessage);
client.on("interactionCreate", handleSlash);

client.login(process.env.TOKEN);
