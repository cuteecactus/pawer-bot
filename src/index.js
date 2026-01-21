import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import "./database/db.js";
import { loadGuild } from "./services/guildService.js";
import { autoSaveAll } from "./services/userService.js";
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

client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;

  const result = checkSpam(message);
  if (!result.spam) {
    handleMessage(message);
    return;
  }

  // Always delete spam message
  await message.delete().catch(() => {});

  // Warn user if violations < max
  if (result.violations < result.config.maxViolations) {
    const warnMsg = await message.channel.send(
      `⚠️ ${message.author}, slow down! (${result.violations}/${result.config.maxViolations})`
    );
    setTimeout(() => warnMsg.delete().catch(() => {}), 4000);
    return;
  }

  // Timeout on final violation
  try {
    const member = await message.guild.members.fetch(message.author.id);
    if (member.moderatable) {
      await member.timeout(result.config.timeoutSeconds * 1000, "Anti-spam system");
      message.channel.send(`🔇 ${message.author} has been timed out for spamming.`);
    }
  } catch (_) {}
  
  
});
client.on("interactionCreate", handleSlash);

client.login(process.env.TOKEN);
