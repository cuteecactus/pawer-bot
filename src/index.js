import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import "./database/db.js";
import { loadGuild } from "./services/guildService.js";
import { autoSaveAll } from "./services/userService.js";
import { loadCommands } from "./commands/commandHandler.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

setInterval(() => {
  try {
    autoSaveAll();
    console.log("Pawer: Auto-saved all cached data.");
  } catch (err) {
    console.error("Error during auto-save:", err);
  }
}, 5 * 60 * 1000); // every 5 minutes

client.once("ready", () => {
  console.log(`Pawer online as ${client.user.tag}`);
  client.guilds.cache.forEach(g => loadGuild(g.id));
  loadCommands();
});

client.on("guildCreate", guild => {
  loadGuild(guild.id);
});

// client.on("messageCreate", handleCommand);

client.login(process.env.TOKEN);
