import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import "./database/db.js";
import { loadGuild } from "./services/guildService.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Pawer online as ${client.user.tag}`);
  client.guilds.cache.forEach(g => loadGuild(g.id));
});

client.on("guildCreate", guild => {
  loadGuild(guild.id);
});

client.login(process.env.TOKEN);
